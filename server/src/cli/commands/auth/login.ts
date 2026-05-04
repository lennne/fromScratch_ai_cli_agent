import {cancel, confirm, intro, isCancel, outro} from "@clack/prompts";


import chalk from "chalk";
import {Command} from "commander";
import os from "os";
import path from "path";
import * as z from "zod/v4";
import dotenv from "dotenv";

dotenv.config();

// predefined variables
const URL = "http://localhost:3005";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

// `z.object()` returns a schema(shape) of the object to be received
 const loginSchema = z.object({
        'serverUrl': z.string().optional(),
        'clientId': z.string().optional()
    });

// `z.infer` - property - returns the type of the schema
type LoginOptions = z.infer<typeof loginSchema>;
 
export async function loginAction(opts: LoginOptions){
  
    const validatedData = loginSchema.parse(opts);
    const serverUrl = validatedData.serverUrl || URL;
    const clientId = validatedData.clientId || CLIENT_ID;

    // display an intro
    intro(chalk.bold("🔐Auth CLI Login"))

    const tokenExists = true;
    const tokenExpired = true;

    if(tokenExists && !tokenExpired){
        const shouldReAuth = await confirm({
            message: "You are already logged in. Do you want to login again?",
            initialValue: false
        })

        if(isCancel(shouldReAuth) || !shouldReAuth){
            cancel("Login Cancelled");
            process.exit(0);
        }
    }

}

export const login = new Command("login")
        .description("Login to Better Auth")
        .option("--server-url <url>", "The Better Auth server URL", URL)
        .option("--client-id <client-id>", "The OAuth client ID", CLIENT_ID)
        .action(loginAction);