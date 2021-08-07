import { Router, Application } from "express";
import { DockerDir } from "../Config";
import { DockerCompose } from "../Docker/DockerCompose";
import PullImage from "../Docker/Pull";
import { ICD } from "../Interfaces/CD";
import AW from "../Lib/Async";
import { getCDSocketBuild, getCDSocketLogs } from "../Lib/CDSocket";
import log from "../Lib/Logger";
import CDModel from "../Models/CD";
import SOCKET from "../Server";

export default class WebhookRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/webhook", this.router);

        this.router.post("/:webhookUrl", async (req, res) => {
            const webhookUrl = req.params.webhookUrl;

            const [CD, C_Error] = await AW<ICD>(CDModel.findOne({ webhookUrl: webhookUrl }));

            if(C_Error)
            {
                log.error(`Something went wrong fetching`, log.trace());
                return res.sendStatus(400);
            }

            if(!CD)
            {
                log.warning(`${webhookUrl} was attempted for POST`);
                return res.sendStatus(400);
            }

            SOCKET.emit(getCDSocketLogs(CD.name), `New image ready.`);
            
            const dir = DockerDir+"/"+CD.name;
            const [Image, I_Error] = await AW(PullImage(dir, CD.name));
            
            if(!Image || I_Error)
            {
                log.error(`Unable to pull image: ${CD.image}`);
                SOCKET.emit(getCDSocketLogs(CD.name), `Unable to pull image: ${CD.image}`);
                return res.sendStatus(400);
            }

            DockerCompose(DockerDir+`/${CD.name}`, CD.name);

            log.info(`Recreating: ${CD.name}`);
            SOCKET.emit(getCDSocketBuild(CD.name), `Recreating: ${CD.name}`);

            return res.sendStatus(200);
        });

    }
}