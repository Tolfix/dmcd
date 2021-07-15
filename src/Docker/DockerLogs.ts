import docker from "docker-compose";
import AW from "../Lib/Async";

export async function DockerLogs(dir: string, cdname: string): Promise<void>
{
    const [Logs, L_Error] = await AW(docker.logs("", {
                                        cwd: dir,
                                        follow: true
                                    }));

    if(!Logs || L_Error)
    {

    }

    // Logs.out
};