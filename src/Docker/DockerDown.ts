import docker from "docker-compose";
import AW from "../Lib/Async";
import log from "../Lib/Logger";

/**
 * @description
 * Removes a container
 */
export default function DockerRemove(dir: string): Promise<Boolean>
{
    return new Promise(async (resolve, reject) => {
        const [DS, D_Error] = await AW(docker.down({
            cwd: dir
        }));

        if(D_Error)
        {
            log.error(`${DS?.err.trim()}`);
            resolve(false);
        }

        resolve(true);
    });
}