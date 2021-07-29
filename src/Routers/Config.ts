import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import bcrypt from "bcryptjs";
import AW from "../Lib/Async";
import UserModel from "../Models/User";
import log from "../Lib/Logger";
import ConfigModel from "../Models/Config";
import { IConfig } from "../Interfaces/Config";
import { SendEmail } from "../Lib/Email";
import { ConfigMap } from "../Config";
import { EditEnvFile } from "../Lib/EditEnv";
export default class ConfigRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application)
    {
        this.server = server;
        this.router = Router();
        this.server.use("/config", EnsureAuth, this.router);

        this.router.get("/", async (req, res) => {
            const Configs = await ConfigModel.find();
            res.render("Config/Main", {
                configs: Configs[0]
            });
        });

        this.router.post("/edit/admin/password", async (req, res) => {
            const newPassword = req.body.password;
            
            if(!newPassword)
            {
                req.flash("error", "Please ensure you type in a password.");
                return res.redirect("back");
            }

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, async (err, hash) => {
                    if(err)
                        log.error(err, log.trace())

                    //Find our admin user;
                    const [user, U_Error] = await AW<any>(UserModel.findOne({ username: "admin" }));

                    if(!user || U_Error)
                    {
                        if(U_Error)
                            log.error(U_Error);
                        req.flash("error", `Something went wrong, try again later.`);
                        return res.redirect("back");        
                    }
                    
                    user.password = hash;
                    
                    user.save();
                });
            });
            
            return res.redirect("back");
        });
        
        this.router.post("/edit/smtp", async (req, res) => {
            let { host, port, secure, username, password } = req.body;
            
            const [Config, C_Error] = (await AW<IConfig[]>(ConfigModel.find()))
            
            if(!Config || C_Error)
            {
                req.flash("error", `Something went wrong, try again later.`);
                return res.redirect("back");
            }

            let config = Config[0];
            let smtp = config.smtp;

            if(host !== smtp.host)
                smtp.host = host;
            
            if(port !== smtp.port)
                smtp.port = port;
            
            if(secure === "on" && !smtp.secure)
                smtp.secure = true;

            if(!secure && smtp.secure)
                smtp.secure = false;

            if(username !== smtp.auth.user)
                smtp.auth.user = username;

            if(password !== smtp.auth.password)
                smtp.auth.password = password


            config.smtp = smtp;
            config.markModified("smtp");
            await config.save();
            req.flash("success", `Succesfully modified SMTP settings`);
            return res.redirect("back");
        
        });

        this.router.post("/smtp/test", async (req, res) => {
            const reciever = req.body.reciever;
            if(!reciever)
                return res.redirect("back");

            SendEmail(reciever, "Test Email", {
                body: "This is a test email",
                isHTML: false
            }, (err, success) => {
                if(err)
                {
                    log.error(err);
                    req.flash(`error`, `Unable to send email, check settings!`);
                    return res.redirect("back");
                }

                req.flash(`success`, `Succesfully sent email.`);
                return res.redirect("back");
            })
        });

        this.router.post("/edit/domain", async (req, res) => {
            const { ssl, domain } = req.body;
            
            const [Config, C_Error] = await AW<IConfig[]>(ConfigModel.find());

            if(!Config || C_Error)
            {
                if(C_Error)
                    log.error(C_Error);

                req.flash("error", `Something went wrong, try again later.`);
                return res.redirect("back");                    
            }

            Config[0].domain = domain;
            Config[0].ssl = ssl === "on" ? true : false;

            ConfigMap.set("domain", domain);
            ConfigMap.set("http", ssl === "on" ? "https" : "http");

            EditEnvFile({
                DOMAIN: domain,
                HTTP: ssl === "on" ? "https" : "http"
            });

            await Config[0].save();

            req.flash("success", "Succesfully changed domain settings, ensure to restart too.");
            return res.redirect("back");
        });

        this.router.post("/edit/title", async (req, res) => {

            const title = req.body.title;

            if(!title)
            {
                req.flash("error", `Please include a title in the body`);
                return res.redirect("back");   
            }

            const [Config, C_Error] = await AW<IConfig[]>(ConfigModel.find());

            if(!Config || C_Error)
            {
                if(C_Error)
                    log.error(C_Error);

                req.flash("error", `Something went wrong, try again later.`);
                return res.redirect("back");                    
            };

            let config = Config[0];

            config.title = config.title === title ? config.title : title;

            ConfigMap.set("title", title);

            EditEnvFile({
                TITLE: title
            });

            await config.save();

            req.flash("success", "Succesfully changed domain settings, ensure to restart too.");
            return res.redirect("back");
        });

    }
}