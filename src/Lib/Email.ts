import { IBodyEmail, IEmail } from "../Interfaces/Email";
import mail from "nodemailer";
import AW from "./Async";
import { GetSMTPConfig } from "../Config";

export async function SendEmail(
    reciever: string, 
    subject: string, 
    body: IBodyEmail, 
    callback?: (error: Error|null, sent: Boolean|null) => void
): Promise<Boolean | void>
{
    const [SMTPConfig, SMTP_Error] = await AW(GetSMTPConfig());
    if(!SMTPConfig || SMTP_Error)
    {
        throw new Error(`No SMTP config.`);
    }

    const config = {
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        auth: {
            user: SMTPConfig.auth.user,
            pass: SMTPConfig.auth.password
        },
        tls: {
            rejectUnauthorized: false
        }
    }

    let email: IEmail = {
        from: `"DMCD" <${SMTPConfig.auth.user}>`,
        to: `${reciever}`,
        subject: subject,
    }

    if(body.isHTML)
        email.html = body.body;

    if(!body.isHTML)
        email.text = body.body

    const transport = mail.createTransport(config);

    transport.sendMail(email).then(e => {
        callback ? callback?.(null, true) : Promise.resolve(true);
    }).catch(e => {
        callback ? callback?.(e, false) : Promise.resolve(false);
    });
}