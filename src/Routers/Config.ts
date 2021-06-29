import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import { Server } from "socket.io";

export default class ConfigRouter {
    protected server: Application;
    protected router: Router;
    protected io: Server;

    constructor(server: Application, io: Server) {
        this.server = server;
        this.io = io;
        this.router = Router();
        this.server.use("/config", EnsureAuth, this.router);

        this.router.get("/", (req, res) => {
            res.render("Config/Main");
        });

    }
}