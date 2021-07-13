import { Building, Active, Failed, Statues } from "./Statues";

export type CD = "cd";
export type CDStatues = typeof Building | typeof Active | typeof Failed | "logs";
export type CDEmitLog = `${CD}-${string}-${CDStatues}`