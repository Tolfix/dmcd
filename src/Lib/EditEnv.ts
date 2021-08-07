import fs from "fs";
import { Dir } from "../Config";
import { IENV } from "../Interfaces/ENV";
import { env_seperator } from "./Seperator";

/**
 * @description
 * Edits the .env file on the machine.
 */
export function EditEnvFile(envOptions: Partial<IENV>)
{
    // Get our file and parse through each.
    const envFile = fs.readFileSync(Dir+"/.env").toString("ascii");
    const envs = envFile.split("\n");

    let tempEnvOptions: typeof envOptions = {};

    for(const env of envs)
    {
        const { value, name } = env_seperator<keyof IENV>(env);
        tempEnvOptions[name] = value;

        // Replace data
        if(envOptions[name] && envOptions[name] !== tempEnvOptions[name])
            tempEnvOptions[name] = envOptions[name];
    }

    let data = ``;

    for(const key in tempEnvOptions)
    {
        data += `${key}=${tempEnvOptions[key as keyof IENV]}\n`
    }

    fs.writeFileSync(Dir+"/.env", data);
}