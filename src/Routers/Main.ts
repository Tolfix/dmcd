import { Router, Application } from "express";
import passport from "passport";
import EnsureAuth from "../Middlewares/EnsureAuth";
import { Server } from "socket.io";
import AW from "../Lib/Async";
import CDModel from "../Models/CD";

export default class MainRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);

        this.router.get("/", EnsureAuth, async (req, res) => {
            const [ CD, C_Error ] = await AW(CDModel.find());
            res.render("Main", {
                cds: CD
            });
        });

        this.router.get("/login", (req, res) => {
            res.render("Login");
        });

        this.router.post("/login", (req, res, next) => {
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
            })(req, res, next);
        });

        this.router.get("/logout", (req, res) => {
            req.logout();
            res.redirect("/login");
        });

    }
}