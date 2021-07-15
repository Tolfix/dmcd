import { Document } from "mongoose"

export interface IDCD extends ICD, Document {};
export interface ICD
{
    name: string;
    image: string;
    env?: Array<ENV>;
    ports?: Array<PORTS>;
    webhookUrl: string;
    status: string;
    logs: Array<ICDLog>;
    email: Boolean;
    email_noti: EmailNoti;
    email_reciever: string;
    restartPolicy: "always" | "never" | "on_failure" | "unless_stopped";
}

export interface ENV
{
    value: string;
    name: string;
}

export interface PORTS
{
    host: string;
    container: string;
}

export interface ICDLog
{
    read: Boolean;
    msg: string;
    date: Date;
}

export interface EmailNoti
{
    onFail: Boolean;
    onActive: Boolean;
    onBuild: Boolean;
    onLog: Boolean;
}