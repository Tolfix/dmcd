import { stripIndent } from "common-tags"
import { ICD } from "../Interfaces/CD";
import docker from "docker-compose";
import log from "../Lib/Logger";
import AW from "../Lib/Async";
import { ICreateDockerCompose } from "../Interfaces/Docker";
import SOCKET from "../Server";
import { getCDSocketActive, getCDSocketFail } from "../Lib/CDSocket";
import { DebugMode } from "../Config";

export function DockerCompose(dir: string, cdName?: string): Promise<Boolean>
{
    return new Promise(async (resolve, reject) => {
        const [DS, D_Error] = await AW(docker.upAll({
            cwd: dir
        }));

        if(D_Error)
        {
            if(cdName)
                SOCKET.emit(getCDSocketFail(cdName), `Failed to build`);
            log.error(D_Error);
            if(DebugMode)
                console.log(D_Error);
            return resolve(false);
        }

        if(cdName)
            SOCKET.emit(getCDSocketActive(cdName), `Recreation was a success`);
        return resolve(true);
    });
}

export function CreateDockerCompose(options: ICreateDockerCompose): string
{

    let envs = stripIndent`
    version: '2'
    services:
        ${options.name}:
            image: ${options.image}
            restart: ${options.restartPolicy}
            ${options.env ? stripIndent`environment:
${options.env.map((e) => `              - ${e.name}=${e.value}\n`).reduce((a,b) => `${a}${b}`)}` : ""}
            ${options.ports ? stripIndent`ports:
${options.ports.map((e) => `              - "${e.host}:${e.container}"\n`).reduce((a,b) => `${a}${b}`)}` : ""}
            
    `;

    return envs;
}