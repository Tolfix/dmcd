import { Router, Application } from "express";
import passport from "passport";

export default class MainRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);

        this.router.get("/", (req, res) => {

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