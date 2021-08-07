import { Document } from "mongoose"

/**
 * @description
 * ICD but extended with Doucment
 */
export interface IDCD extends ICD, Document {};
/**
 * @description
 * CD object.
 */
export interface ICD
{
    /**
     * The name for the CD
     */
    name: string;
    /**
     * Image for CD
     */
    image: string;
    /**
     * Env variables for CD
     */
    env?: Array<ENV>;
    /**
     * Ports for cd
     */
    ports?: Array<PORTS>;
    /**
     * The webhook endpoint which is linked to this CD
     */
    webhookUrl: string;
    /**
     * The current status for this CD
     */
    status: string;
    /**
     * The logs for this CD
     */
    logs: Array<ICDLog>;
    /**
     * If this CD should send emails on notifications
     */
    email: Boolean;
    /**
     * What kind of emails should we send when a event happens
     */
    email_noti: EmailNoti;
    /**
     * The email which should recieve the notification
     */
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
    /**
     * @description
     * If someone has read it.
     * @deprecated
     */
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