import { stripIndent } from "common-tags"
import { ICD } from "../Interfaces/CD";
import docker from "docker-compose";
import log from "../Lib/Logger";
import AW from "../Lib/Async";

export async function DockerCompose(dir: string): Promise<void>
{
    
    const [DS, D_Error] = await AW(docker.upAll({
        cwd: dir
    }));
}

export function CreateDockerCompose(options: ICD): string
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