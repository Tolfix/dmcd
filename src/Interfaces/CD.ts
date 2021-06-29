import { Document, model, Schema } from "mongoose"

export interface ICD
{
    name: string;
    image: string;
    env?: Array<ENV>;
    ports?: Array<PORTS>;
    webhookUrl: string;
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