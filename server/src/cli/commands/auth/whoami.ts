import chalk from "chalk";
import { prisma } from "../../../lib/db";
import { requireAuth } from "../../../lib/token";
import { Command } from "commander";

const URL = "http://localhost:3005";

export async function whoamiAction() {
    const token = await requireAuth();

    if (!token?.access_token) {
        console.log("No access token found. Please login")
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                sessions: {
                    some: {
                        token: token.access_token,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        if (!user) {
            console.log(chalk.red("❌ Active database session profile data could not be recovered. Please execute 'orbital login'."));
            return process.exit(1);
        }

        // Output user session info
        console.log(
            chalk.bold.greenBright(`
            👤 User: ${user?.name}
            📧 Email: ${user?.email}
            👤 ID: ${user?.id}`)
        )

        return process.exit(0);
    } catch (error) {
        console.log(chalk.red("Error trying to fetch user"), error);
        return process.exit(0);
    }


}

export const whoami = new Command("whoami")
    .description("Show current authenticated user")
    .option("--server-url", "The Better Auth server URL", URL)
    .action(whoamiAction);