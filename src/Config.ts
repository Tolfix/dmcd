import { IConfig, ISMTP } from "./Interfaces/Config";
import AW from "./Lib/Async";
import ConfigModel from "./Models/Config";

export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const MongoDB_URI = process.env.MONGODB_URI ?? "mongodb://localhost/dmcd";
export const Web_Title = process.env.TITLE ?? "DMCD"; 
export const PORT = 56251;
export const Session_Secret = process.env.SESSION_SECRET ?? undefined;
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
export const Domain = process.env.DOMAIN ?? "localhost";
export const HTTPS: "https" | "http" = process.env.HTTP as "https" ?? "http"
export const DockerDir = ((__dirname.replace("\\build", "")).replace("/build", ""))+"/Docker";