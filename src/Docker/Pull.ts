import docker from "docker-compose";
import AW from "../Lib/Async";
import log from "../Lib/Logger";

export default function PullImage(image: string): Promise<Boolean>
{
    return new Promise(async (resolve, reject) => {
        const [Image, I_Error] = await AW(docker.pullOne(image));

        if(I_Error)
        {
            log.error(`Unable to pull image: ${I_Error}`);
            return resolve(false);
        }
        log.info(Image);
        return resolve(true);
    });
}