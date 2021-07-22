import { ConfigMap } from "../Config";
import { IConfig } from "../Interfaces/Config";
import AW from "../Lib/Async";
import log from "../Lib/Logger";
import ConfigModel from "../Models/Config";

export default async function reCache()
{
    const [Config, C_Error] = await AW<IConfig[]>(ConfigModel.find());

    if(Config)
    {
        let config = Config[0];
        ConfigMap.set("domain", config.domain);

        ConfigMap.set("http", config.ssl ? "https" : "http");
    }


    log.info(`Re cached from database`);
}