import { Router, Application } from "express";
import { Server } from "socket.io";

export default class WebhookRouter {
    protected server: Application;
    protected router: Router;
    protected io: Server;

    constructor(server: Application, io: Server) {
        this.server = server;
        this.io = io;
        this.router = Router();
        this.server.use("/webhook", this.router);

        this.router.post("/:webhookId", (req, res) => {
            const webhookId = req.params.webhookId;
        });

    }
}