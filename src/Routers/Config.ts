import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import bcrypt from "bcryptjs";
import AW from "../Lib/Async";
import ConfigModel from "../Models/Config";
import UserModel from "../Models/User";
import { IConfig } from "../Interfaces/Config";
import log from "../Lib/Logger";
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

    }
}