import { stripIndent } from "common-tags"
import { ICD } from "../Interfaces/CD";
import cp from "child_process";
import log from "../Lib/Logger";

export function DockerCompose(dir: string): void
{
    
    const ls = cp.spawn('docker-compose', ['up', '-d'], {
        cwd: dir
    });

    ls.stdout.on('data', (data) => {
            log.info(data)
    });

    ls.stderr.on('data', (data) => {
            log.error(data)
    });

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
${options.ports.map((e) => `              - ${e.host}=${e.container}\n`).reduce((a,b) => `${a}${b}`)}` : ""}
            
    `;

    return envs;
}