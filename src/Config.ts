export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const MongoDB_URI = process.env.MONGODB_URI ?? "";
export const Web_Title = process.env.TITLE ?? "DMCD"; 
export const PORT = 56251;
export const Session_Secret = process.env.SESSION_SECRET ?? undefined;
export const Domain = process.env.DOMAIN ?? undefined
export const DockerDir = ((__dirname.replace("\\build", "")).replace("/build", ""))+"/Docker";