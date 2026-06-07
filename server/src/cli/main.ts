#!/usr/bin/env npx tsx

import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";

import {Command} from "commander";
import {login} from "./commands/auth/login";
import { wakeUp } from "./commands/ai/wakeUp";

dotenv.config();


async function main(){
    // Display a banner in the console
    console.log( // don't mind this detail it's just me thinking out loud. but if this is what i think it is, 
        // then we're a litterally console.logging
        // every the different characters to make the banner which is a text, in this case, "Orbital CLI". if i think
        // about it like this, this could be how graphic engines map out pixels, events and combine the different
        // pixels and events to create functionalities and graphics on the computer screen and makes things appear
        // the way the look. taking this a step further you can make a 3D rendering or 2D rendering. so the principle
        // of going from machine code, to creating assembly code, then making high level languages, then libraries, 
        // then frameworks applies everywhere in computing. hmmm interesting.
        chalk.cyan(
            figlet.textSync("Orbital CLI", {
                font: "Standard",
                horizontalLayout: "default"
            })
        ) 
    )

    console.log(chalk.gray("A cli based AI tool \n"))

    const program = new Command("orbital")


    program.version("0.0.1")
        .description("Orbital CLI - A Cli Based AI Tool")
        .addCommand(login);
        // .addCommand(logout);
        // .addCommand(wakeUp);
        
    program.action(() => {
        program.help();
     });

    program.parse(); 
}

main().catch((err) => {
    console.log(chalk.red("Error running orbital CLI: "), err);
    process.exit()
})