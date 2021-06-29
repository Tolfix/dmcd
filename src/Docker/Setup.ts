import fs from "fs";
import cp from "child_process";
import { DockerDir } from "../Config";
import { ISetupDocker } from "../Interfaces/SetupDocker";
import { CreateDockerCompose, DockerCompose } from "./DockerCompose";
import AW from "../Lib/Async";
import PullImage from "./Pull";

export default function SetupDocker(options: ISetupDocker): Promise<string>
{
    return new Promise(async (resolve, reject) => {
        const [Image, I_Error] = await AW(PullImage(options.image));
    
        if(!Image)
            return reject("Failed to pull image " + options.image);

        if (!fs.existsSync(DockerDir))
        {
            fs.mkdirSync(DockerDir);
        }
    
        // Create docker-compose.yml
        const file = CreateDockerCompose(options);
        const fileDir = DockerDir+`/${options.name}/docker-compose.yml`;
        const Dir = DockerDir+`/${options.name}`;
    
        if (!fs.existsSync(Dir))
        {
            fs.mkdirSync(Dir);
        }
    
        const [] = await AW(fs.appendFileSync(fileDir, file));

        DockerCompose(Dir);

        resolve("Finished")
    });
}