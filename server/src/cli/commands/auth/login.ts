import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";


import chalk from "chalk";
import { Command } from "commander";
import os from "os";
import path from "path";
import open from "open";
import * as z from "zod/v4";
import dotenv from "dotenv";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import yoctoSpinner from "yocto-spinner";
import { logger } from "better-auth";
import { getStoredToken, isTokenExpired, storeToken } from "../../../lib/token";
import type { AuthToken } from "../../../types/auth";

dotenv.config();

// predefined variables
const URL = "http://localhost:3005";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
export const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");



// `z.object()` returns a schema(shape) of the object to be received
const loginSchema = z.object({
    'serverUrl': z.string().optional(),
    'clientId': z.string().optional()
});

// `z.infer` - property - returns the type of the schema
type LoginOptions = z.infer<typeof loginSchema>;

export async function loginAction(opts: LoginOptions) {

    const validatedData = loginSchema.parse(opts);
    const serverUrl = validatedData.serverUrl || URL;
    const clientId = validatedData.clientId || CLIENT_ID;

    // display an intro
    intro(chalk.bold("🔐Auth CLI Login"))

    const existingToken = await getStoredToken();
    const tokenExpired = await isTokenExpired();

    if (existingToken && !tokenExpired) {
        const shouldReAuth = await confirm({
            message: "You are already logged in. Do you want to login again?",
            initialValue: false
        })

        if (isCancel(shouldReAuth) || !shouldReAuth) {
            cancel("Login Cancelled");
            process.exit(0);
        }
    }

    const authClient = createAuthClient({
        baseURL: serverUrl,
        plugins: [deviceAuthorizationClient()]
    })

    const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
    spinner.start();

    // Request a code
    try {
        const { data, error } = await authClient.device.code({
            client_id: clientId || "",
            scope: "openId profile email"
        })

        spinner.stop();

        if (error || !data) {
            logger.error(`Failed to request device authorization: `, error)

            process.exit(1);
        }

        const {
            device_code,
            user_code,
            verification_uri,
            verification_uri_complete,
            interval = 5,
            expires_in
        } = data;

        console.log(chalk.cyan("Device Authorization Required"));

        console.log(`Please visit "${chalk.underline.blue(verification_uri || verification_uri_complete)}`)

        console.log(`Enter Code: ${chalk.bold.green(user_code)}`)

        const shouldOpen = await confirm({
            message: "Open browser automatically",
            initialValue: true
        })

        if (!isCancel(shouldOpen) && shouldOpen) {
            const urlToOpen = verification_uri_complete || verification_uri;
            
            if (urlToOpen){
                await open(urlToOpen)
            } else {
                console.log(
                    chalk.red("❌ Verification URL missing from authorization gateway response.")
                )
            }
            
        }

        console.log(chalk.gray(`Waiting for authorization ( expires in ${Math.floor(
            expires_in / 60)} minutes)...`)
        )

        const token = await pollForToken(
            authClient,
            device_code,
            clientId || "",
            interval
        )

        if (token) {
            const saved = await storeToken(token);

            if (!saved) {
                console.log(
                    chalk.yellow("\n⚠️ Warning: Could not save authentication token.")
                );

                console.log(
                    chalk.yellow("You may need to login again on next use.")
                );
            }

            // todo: get the user data

            outro(chalk.green("Login successfull!"))

            console.log(chalk.gray(`\n Token saved to: ${TOKEN_FILE}`))

            console.log(
                chalk.gray("You can now use AI commands without logging in again.\n")
            )
        }

    } catch (error) {
        if (error instanceof Error) {
            spinner.stop()
            console.error(
                chalk.red("\nLogin failed:"), error.message
            );
        }

        process.exit(1);

    }

}

async function pollForToken(
    authClient: any,
    deviceCode: string,
    clientId: string,
    initialInterval: number): Promise<AuthToken> {

    let pollingInterval = initialInterval;
    const spinner = yoctoSpinner({
        text: "",
        color: "cyan"
    })
    let dots = 0;

    return new Promise((resolve, reject) => {
        const poll = async () => {
            dots = (dots + 1) % 4;
            spinner.text = chalk.gray(
                `Polling for authorization${".".repeat(dots)}${" ".repeat(3 - dots)}`
            );

            if (!spinner.isSpinning) spinner.start();

            try {
                const { data, error } = await authClient.device.token({
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    device_code: deviceCode,
                    client_id: clientId,
                    fetchOptions: {
                        headers: {
                            "user-agent": `MyCLI`,
                        },
                    },
                })

                if (data?.access_token) {
                    console.log(
                        chalk.bold.yellow(`Your access token: ${data.access_token}`)
                    );

                    spinner.stop();
                    resolve(data);
                    return;
                } else if (error) {
                    switch (error.error) {
                        case "authorization_pending":

                            break;
                        case "slow_down":
                            pollingInterval += 5;
                            break;
                        case "access_denied":
                            console.error("Access was denied by the user");
                            break;
                        case "expired_token":
                            console.error("The device code has expired. Please try again.")
                            break;
                        default:
                            spinner.stop()
                            logger.error(`Error: ${error.error_description}`);
                            process.exit(1);
                    }
                }
            } catch (error: any) {
                spinner.stop();
                logger.error(`Network error: ${error.message}`)
            }

            setTimeout(poll, pollingInterval * 1000);
        }

        setTimeout(poll, pollingInterval * 1000);
    })
}

export const login = new Command("login")
    .description("Login to Better Auth")
    .option("--server-url <url>", "The Better Auth server URL", URL)
    .option("--client-id <client-id>", "The OAuth client ID", CLIENT_ID)
    .action(loginAction);