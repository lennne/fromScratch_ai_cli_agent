import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import chalk from "chalk";
import { clearStoredToken, getStoredToken } from "../../../lib/token";
import { Command } from "commander";

export async function logoutAction() {
    intro(chalk.bold("👋🏽 Logout"));

    const token = await getStoredToken();

    if (!token) {
        console.log(chalk.yellow("You're not logged in."));
        process.exit(0);
    }

    const shouldLogout = await confirm({
        message: "Are you sure you want to logout?",
        initialValue: false,
    })

    if (isCancel(shouldLogout) || !shouldLogout) {
        cancel("Logout cancelled");
        process.exit(0);
    }

    const cleared = await clearStoredToken();

    if (cleared) {
        outro(chalk.green("✅ Successfully logged out!"));
    } else {
        console.log(chalk.yellow("⚠️ Could not clear token file"));
    }
}


export const logout = new Command("logout")
    .description("Logout and clear stored credentials")
    .action(logoutAction);