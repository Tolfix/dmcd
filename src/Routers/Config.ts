import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import bcrypt from "bcryptjs";
import AW from "../Lib/Async";
import UserModel from "../Models/User";
import log from "../Lib/Logger";
import ConfigModel from "../Models/Config";
import { IConfig } from "../Interfaces/Config";
export default class ConfigRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application)
    {
        this.server = server;
        this.router = Router();
        this.server.use("/config", EnsureAuth, this.router);

        this.router.get("/", (req, res) => {
            res.render("Config/Main");
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
            const { host, port, secure, username, password } = req.body;
            
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

            if(port !== smtp.host)
                smtp.host = port;

            if(secure !== smtp.secure)
                smtp.secure = secure;

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

    }
}