import { Router, Application } from "express";
import passport from "passport";
import EnsureAuth from "../Middlewares/EnsureAuth";

export default class MainRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);

        this.router.get("/", EnsureAuth, (req, res) => {
            res.render("Main");
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