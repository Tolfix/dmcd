import { stripIndent } from "common-tags"
import { ICD } from "../Interfaces/CD";
import cp from "child_process";

export function DockerCompose(dir: string): void
{
    const ls = cp.spawn('docker-compose', ['up', '-d'], {
        cwd: dir
    });

    ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
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