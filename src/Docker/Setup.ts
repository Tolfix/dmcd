import fs from "fs";
import { Active, Failed } from "../Types/Statues";
import { DockerDir } from "../Config";
import { ISetupDocker } from "../Interfaces/SetupDocker";
import { CreateDockerCompose, DockerCompose } from "./DockerCompose";
import AW from "../Lib/Async";
import PullImage from "./Pull";
import { getCDSocketActive, getCDSocketBuild, getCDSocketFail } from "../Lib/CDSocket";import SOCKET from "../Server";

/**
 * @description
 * Setups a CD  
 */
export default function SetupDocker(options: ISetupDocker, mong: any): Promise<string>
{
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(DockerDir))
        {
            fs.mkdirSync(DockerDir);
        }

        SOCKET.emit(getCDSocketBuild(options.name), `Building ${options.name}`)
    
        // Create docker-compose.yml
        const file = CreateDockerCompose(options);
        const fileDir = DockerDir+`/${options.name}/docker-compose.yml`;
        const Dir = DockerDir+`/${options.name}`;
    
        if (!fs.existsSync(Dir))
        {
            fs.mkdirSync(Dir);
        }
    
        const [] = await AW(fs.appendFileSync(fileDir, file));

        const [Image, I_Error] = await AW(PullImage(Dir));
    
        if(!Image)
        {
            mong.status = Failed;
            await mong.save();
            SOCKET.emit(getCDSocketFail(options.name), `Failed to pull image`)
            return reject("Failed to pull image " + options.image);
        }

        const [D, D_Error] = await AW(DockerCompose(Dir));

        if(D_Error)
        {
            mong.status = Failed;
            await mong.save();
            SOCKET.emit(getCDSocketFail(options.name), `Failed to build docker`)
            return reject(`Failed to build ${options.name}`);
        }

        mong.status = Active;
        await mong.save();
        SOCKET.emit(getCDSocketActive(options.name), `Docker built and finished`);
        return resolve("Finished");
    });
}