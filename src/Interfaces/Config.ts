import { Document, model, Schema } from "mongoose"

export interface IConfig extends Document
{
    setupDone: Boolean;
    title: String;
    smtp: ISMTP;
}

export interface ISMTP
{
    host: string;
    port: number;
    secure: Boolean;
    auth: ISMTP_Auth;
}

export interface ISMTP_Auth
{
    user: string;
    password: string;
}