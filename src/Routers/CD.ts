import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import { Server } from "socket.io";
import { ENV, ICD, PORTS } from "../Interfaces/CD";
import AW from "../Lib/Async";
import { GenString } from "../Lib/Generator";
import CDModel from "../Models/CD";
import log from "../Lib/Logger";
import SetupDocker from "../Docker/Setup";

export default class CDRouter {
    protected server: Application;
    protected router: Router;
    protected io: Server;

    constructor(server: Application, io: Server) {
        this.server = server;
        this.io = io;
        this.router = Router();
        this.server.use("/cd", EnsureAuth, this.router);

        this.router.post("/create", async (req, res) => {
            // Get data from body
            const { image, name } = req.body;
            let t_port = req.body.port;
            let t_envs = req.body.env;
            if(typeof t_port === "string")
                t_port = [t_port];

            if(typeof t_envs === "string")
                t_envs = [t_envs];

            const envs = (t_envs as Array<string>).map((t_value) => {
                const splited = t_value.split("=");
                return {
                    value: splited[1],
                    name: splited[0]
                }
            });

            const ports = (t_port as Array<string>).map((t_value) => {
                const splited = t_value.split(":");
                return {
                    container: splited[1],
                    host: splited[0]
                }
            });

            let restartPolicy = req.body.restartPolicy ?? "always";
            
            const [webhookId, W_Error ] = await AW(GenString(20));

            if(W_Error || !webhookId)
            {
                log.error(W_Error)
                req.flash("error", "Something went wrong, try again later");
                return res.redirect("back");
            }

            // Create new files for this
            const [D, D_Error] = await AW(SetupDocker({
                                            image: image,
                                            name: name,
                                            ports: ports,
                                            env: envs,
                                            restartPolicy: restartPolicy,
                                            webhookUrl: ""
                                        }))

            if(D_Error)
            {
                log.error(D_Error)
                req.flash("error", D_Error.toString());
                return res.redirect("back");
            }

            // TODO Check if image actually is real? 

            const [CD, C_Error] = await AW<ICD>(new CDModel(<ICD>{
                                                name: name,
                                                env: envs,
                                                ports: ports,
                                                image: image,
                                                webhookUrl: webhookId
                                            }).save());

            if(!CD || C_Error)
            {
                log.error(C_Error)
                req.flash("error", "Something went wrong, try again later");
                return res.redirect("back");
            }

            req.flash("success", "Succesfully created a new CD");
            return res.redirect("back");
        });

    }
}