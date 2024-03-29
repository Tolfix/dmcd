import { config } from "docker-compose";
import { IConfig, ISMTP } from "./Interfaces/Config";
import { IConfigMapIndex } from "./Interfaces/ConfigMap";
import AW from "./Lib/Async";
import ConfigModel from "./Models/Config";

export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const MongoDB_URI = process.env.MONGODB_URI ?? "mongodb://localhost/dmcd";
export const PORT = 56251;
export const Session_Secret = process.env.SESSION_SECRET ?? undefined;

/**
 * 
 * @returns {ISMTP}
 * @description
 * Gives the SMTP configs from database.
 */
export const GetSMTPConfig = () => {
    return new Promise<ISMTP|null>(async (resolve, reject) =>
    {
        const [Config, C_Error] = await AW<IConfig[]>(ConfigModel.find());
        if(!Config || C_Error)
            return resolve(null);
        
        const config = Config[0];
        const c: ISMTP = {
            auth: config.smtp.auth,
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure
        }
        return resolve(c)
    })
};
/**
 * @description
 * Contains all "general" configs in a map
 */
export const ConfigMap = new Map<keyof IConfigMapIndex,  IConfigMapIndex[keyof IConfigMapIndex]>();
export const Dir = ((__dirname.replace("\\build", "")).replace("/build", ""));
export const DockerDir = Dir+"/Docker";

ConfigMap.set("title", process.env.TITLE ?? "DMCD");
ConfigMap.set("domain", process.env.DOMAIN ?? "localhost");
ConfigMap.set("http", process.env.HTTP as "https" ?? "http");