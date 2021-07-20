import docker from "docker-compose";
import AW from "../Lib/Async";
import { getCDSocketLogs } from "../Lib/CDSocket";
import log from "../Lib/Logger";
import SOCKET from "../Server";

export default function PullImage(dir: string, cdName?: string): Promise<Boolean>
{
    return new Promise(async (resolve, reject) => {
        const [Image, I_Error] = await AW(docker.pullAll({
            cwd: dir
        }));

        if(I_Error)
        {
            if(cdName)
                SOCKET.emit(getCDSocketLogs(cdName), `Failed to pull image`);
            log.error(`Unable to pull image`);
            log.error(I_Error);
            console.log(I_Error);
            return resolve(false);
        }

        if(cdName)
            SOCKET.emit(getCDSocketLogs(cdName), `Succesfully pulled image`);
        return resolve(true);
    });
}