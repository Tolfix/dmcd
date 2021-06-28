/**
 * This file will do the setup things
 * 
 * 1. Check if run as root (If false, maybe on windows?)
 * 2. Check if docker is installed
 * 3. Check if docker-compose is installed 
 * 4. Get general information.
 *  * Admin password
 *  * Server name
 *  * Mongodb information
 *      1. Username
 *      2. Password
 *      3. FQDN/IP
 *      4. Which database
 *      5. Is admin?
 *  * ...
 * 5. Create a config file (aka .env file) with the information given.
 * 6. Print everything is done and ready to start.
 */

import log from "./Lib/Logger";
import ce from "command-exists";
import AW from "./Lib/Async";
import prompt from "prompt";
import fs from "fs";
import { GenString } from "./Lib/Generator";

export interface ISetupPrompt
{
    password: string;
    title: string;
    mongodb_username: string;
    mongodb_admin: string;
    mongodb_password: string;
    mongodb_db: string;
    mongodb_ip: string;
    mongodb_port: string;
}

export async function Setup()
{
    // if(process.getuid && process.getuid() === 0)
    //     return log.error(`Not root user, or you are using windows`);

    // const [D_Yes, D_No] = await AW(ce("docker"));

    // if(D_No)
    //     return log.error(`Unable to find docker, please be sure to install docker before running this!`);

    // const [DC_Yes, DC_No] = await AW(ce("docker-compose"));

    // if(DC_No)
    //     return log.error(`Unable to find docker-compose, please be sure to install docker before running this!`);

    prompt.start();

    prompt.get([
        {
            name: "password",
            description: "Password for the admin",
            required: true,
        },
        {
            name: "title",
            description: "Title of this web app",
        },
        {
            name: "mongodb_username",
            description: "Username for the mongodb username",
        },
        {
            name: "mongodb_admin",
            description: "Is this user admin?",
            default: false
        },
        {
            name: "mongodb_password",
            description: "Password for the user for mongodb",
        },
        {
            name: "mongodb_db",
            description: "The database name",
        },
        {
            name: "mongodb_ip",
            description: "The IP or FQDN where the mongodb is located at",
        },
        {
            name: "mongodb_port",
            description: "The port for mongodb (defualt: 27017)",
            default: 27017
        }
    ], async (err, result) => {
        if(err)
            return log.error(`Something went wrong, try again later!`);

        const info = result as unknown as ISetupPrompt

        const mongodb_url = `mongodb://${info.mongodb_username}:${info.mongodb_password}@${info.mongodb_ip}:${info.mongodb_port}/${info.mongodb_db}${info.mongodb_admin === "true" ? "?authSource=admin" : ""}`

        // TODO Create an admin user with this password
        const password = info.password;
        const title = info.title;

        const [Session_Secret, E_Error] = await AW(GenString(53));

        const all = `MONGODB_URI=${mongodb_url}\nTITLE=${title}\nSESSION_SECRET=${Session_Secret}`;

        fs.appendFile('.env', all, function (err) {
            if (err) throw err;
            log.info('Setup complete!');
        });
    });
};  


(async () => {
    await Setup();
})();