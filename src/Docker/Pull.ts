import docker from "docker-compose";
import AW from "../Lib/Async";
import log from "../Lib/Logger";

export default function PullImage(dir: string): Promise<Boolean>
{
    return new Promise(async (resolve, reject) => {
        const [Image, I_Error] = await AW(docker.pullAll({
            cwd: dir
        }));

        if(I_Error)
        {
            log.error(`Unable to pull image`);
            return resolve(false);
        }

        return resolve(true);
    });
}