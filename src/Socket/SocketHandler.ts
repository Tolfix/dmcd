import mongoose from "mongoose";
import { Server } from "socket.io";
import { CDEmitLog } from "../Types/LogTypes";
import CDModel from "../Models/CD";
import AW from "../Lib/Async";
import { IDCD } from "../Interfaces/CD";
import { Statues } from "../Types/Statues";
import { SendEmail } from "../Lib/Email";

export default class SocketHandler
{
    protected io: Server;
    protected db: mongoose.Connection;

    constructor(io: Server, db: mongoose.Connection)
    {
        this.io = io;
        this.db = db;
    }

    private isCD(aString: string): Boolean
    {
        if(aString.includes("cd-"))
            return true;
        return false;
    }

    private getCD(aString: string): string
    {
        return (((aString.split("-"))[1]))
    }

    private EmailCD(cd: IDCD, status: Statues | "log" | string, ...content: string[])
    {
        // Are we allowed to send emails for this CD?
        if(!cd.email)
            return;

        // Check if what type, and then see if that type is allowed to send an email for.
        const notis = cd.email_noti;
        if(status === "active" && notis.onActive)
            return SendEmail(cd.email_reciever, `${cd.name} | ${status.toUpperCase()}`, {
                body: `${content.map((e) => `${e}\n`).reduce((a,b) => `${a}${b}`)}`,
                isHTML: false
            });
        if(status === "building" && notis.onBuild)
            return SendEmail(cd.email_reciever, `${cd.name} | ${status.toUpperCase()}`, {
                body: `${content.map((e) => `${e}\n`).reduce((a,b) => `${a}${b}`)}`,
                isHTML: false
            });
        if(status === "fail" && notis.onFail)
            return SendEmail(cd.email_reciever, `${cd.name} | ${status.toUpperCase()}`, {
                body: `${content.map((e) => `${e}\n`).reduce((a,b) => `${a}${b}`)}`,
                isHTML: false
            });
        if(status === "log" && notis.onLog)
            return SendEmail(cd.email_reciever, `${cd.name} | ${status.toUpperCase()}`, {
                body: `${content.map((e) => `${e}\n`).reduce((a,b) => `${a}${b}`)}`,
                isHTML: false
            });

    }

    private logToDB(type: CDEmitLog | "log", ...msg: any[]): Promise<Boolean>
    {
        return new Promise(async (resolve, reject) => {
            if(type === "log")
            {
                return resolve(true)
            }
    
            const CDName = this.getCD(type);
            const CDStatus = type.split("-")[2];
            const [CD, C_Error] = await AW<IDCD>(CDModel.findOne({ name: CDName }))
            
            if(C_Error || !CD)
                return resolve(false);

            for(const aMsg of msg)
            {
                CD.logs.push({
                    read: false,
                    msg: aMsg,
                    date: new Date()
                });
                
                // Whoops lol
                // this.emit(`cd-${CDName}-logs`, aMsg);    
                if(CDStatus !== "logs")
                    this.io.emit(`cd-${CDName}-logs`, aMsg);

                this.EmailCD(CD, CDStatus, aMsg);
            }
            if(CDStatus !== "logs")
                CD.status = CDStatus;
            await CD.save();
            return resolve(true);
        })
    }

    public emit(event: any, ...args: any[]): void
    {
        this.io.emit(event, args);

        if(this.isCD(event))
            this.logToDB(event, args)
    }
}