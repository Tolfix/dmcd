import { Router, Application } from "express";
import EnsureAuth from "../Middlewares/EnsureAuth";
import { Server } from "socket.io";
import fs from "fs";
import { ENV, ICD, IDCD, PORTS } from "../Interfaces/CD";
import AW from "../Lib/Async";
import { GenString } from "../Lib/Generator";
import CDModel from "../Models/CD";
import log from "../Lib/Logger";
import SetupDocker from "../Docker/Setup";
import { DockerDir } from "../Config";
import DockerRemove from "../Docker/DockerDown";
import { CreateDockerCompose, DockerCompose } from "../Docker/DockerCompose";
import SOCKET from "../Server";
import { getCDSocketBuild, getCDSocketLogs } from "../Lib/CDSocket";
import PullImage from "../Docker/Pull";

export default class CDRouter {
    protected server: Application;
    protected router: Router;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/cd", EnsureAuth, this.router);

        this.router.post("/create", async (req, res) => {
            // Get data from body
            const { image, name } = req.body;
            let t_port = req.body.port;
            let t_envs = req.body.env;
            let envs;
            let ports;

            if(typeof t_envs === "string")
                t_envs = [t_envs];

            if(t_envs[0] !== "")
                envs = (t_envs as Array<string>).map((t_value) => {
                    const splited = t_value.split("=");
                    return {
                        value: splited[1],
                        name: splited[0]
                    }
                });

            if(typeof t_port === "string")
                t_port = [t_port];

            if(t_port[0] !== "")
                ports = (t_port as Array<string>).map((t_value) => {
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

            // TODO Check if image actually is real?
            const [CD, C_Error] = await AW<ICD>(new CDModel(<ICD>{
                                                name: name,
                                                env: envs,
                                                ports: ports,
                                                image: image,
                                                webhookUrl: webhookId,
                                                status: "building"
                                            }).save());

            if(!CD || C_Error)
            {
                log.error(C_Error)
                req.flash("error", "Something went wrong, try again later");
                return res.redirect("back");
            }

            // Fix this later me
            // @Tolfx
            // Fixed *phew*
            SetupDocker({
                image: image,
                name: name,
                ports: ports,
                env: envs,
                restartPolicy: restartPolicy,
            }, CD)

            req.flash("success", "Succesfully created a new CD");
            return res.redirect("back");
        });

        this.router.get("/remove/:CD", async (req, res) => {
            const CD = req.params.CD;

            // Find if this CD really is real
            const [CDM, C_Error] = await AW<ICD>(CDModel.findOne({ name: CD }));

            if(C_Error || !CDM)
            {
                req.flash(`error`, `Unable to find this CD ${CD}`);
                return res.redirect("back");
            }

            const dir = DockerDir+`/${CDM.name}`
            // Check if dir cd is there
            if(fs.existsSync(dir))
            {
                await DockerRemove(dir);

                // Remove dir where CD is located at
                fs.rmdir(DockerDir+`/${CDM.name}`, { recursive: true }, (err) => {
                    if (err) {
                        log.error(`Unable to delete dir, maybe it doesn't exists?`)
                    }
                
                    log.info(`${CDM.name} was deleted from Docker/`);
                });
            }

            // Delete from database
            await CDModel.deleteOne({ name: CDM.name });
            req.flash("success", `Removed ${CD}`);
            return res.redirect("back");
        });

        this.router.put("/edit/:cd", async (req, res) => {
            const CD = req.params.cd;

            // Find if this CD really is real
            const [CDM, C_Error] = await AW<IDCD>(CDModel.findOne({ name: CD }));

            if(C_Error || !CDM)
            {
                req.flash(`error`, `Unable to find this CD ${CD}`);
                return res.redirect("back");
            }

            const image = req.body.image;
            let t_port = req.body.port;
            let t_envs = req.body.env;
            let envs;
            let ports;

            if(typeof t_envs === "string")
                t_envs = [t_envs];

            if(t_envs && t_envs[0] !== "")
                envs = (t_envs as Array<string>).map((t_value) => {
                    const splited = t_value.split("=");
                    return {
                        value: splited[1],
                        name: splited[0]
                    }
                });

            if(typeof t_port === "string")
                t_port = [t_port];

            if(t_port && t_port[0] !== "")
                ports = (t_port as Array<string>).map((t_value) => {
                    const splited = t_value.split(":");
                    return {
                        container: splited[1],
                        host: splited[0]
                    }
                });


            if(image)
            {
                if(image !== CDM.image)
                {
                    CDM.image = image;
                }
            }

            if(envs)
            {
                if(envs !== CDM.env)
                {
                    CDM.env = envs;
                }
            }


            if(ports)
            {
                if(ports !== CDM.ports)
                {
                    CDM.ports = ports;
                }
            }

            await CDM.save();

            // Rebuild docker-compose file
            // Aka remove it and create a new one..
 
            const dir = DockerDir+`/${CDM.name}`
            // Check if dir cd is there
            if(fs.existsSync(dir))
            {
                fs.unlinkSync(DockerDir+`/${CDM.name}/docker-compose.yml`);
                const file = CreateDockerCompose(
                    {
                        image: image,
                        name: CDM.name,
                        env: envs,
                        ports: ports,
                        restartPolicy: CDM.restartPolicy,
                    }
                )
                const fileDir = DockerDir+`/${CDM.name}/docker-compose.yml`;
                const Dir = DockerDir+`/${CDM.name}`;

                fs.appendFileSync(fileDir, file);
                
                DockerCompose(Dir, CD);
                log.info(`Recreating: ${CD}`);
                SOCKET.emit(getCDSocketBuild(CD), `Recreating: ${CD}`);
            }
            
            // Not there? well shit
            if(!fs.existsSync(dir))
            {
                log.error(`Unable to find DIR... ${dir}`);
            }           
            log.info(`Succesfully edited ${CD}`);
            SOCKET.emit(getCDSocketLogs(CD), `Succesfully edited ${CD}`)
            return res.redirect("back");
        });

        this.router.get("/logs/:cd", async (req, res) => {
            const CD = req.params.cd;
            
            
        });
        
        this.router.post("/pull/:cd", async (req, res) => {
            const CD = req.params.cd;
    
            const [CDM, C_Error] = await AW<IDCD>(CDModel.findOne({ name: CD }));

            if(C_Error || !CDM)
            {
                req.flash(`error`, `Unable to find this CD ${CD}`);
                return res.redirect("back");
            }
            
            const dir = DockerDir+"/"+CDM.name;
            
            PullImage(dir, CDM.name)
            
            SOCKET.emit(getCDSocketLogs(CDM.name), `Pulling image..`);

            return res.redirect("back");
        });

        this.router.post("/build/:cd", async (req, res) => {
            const CD = req.params.cd;
    
            const [CDM, C_Error] = await AW<IDCD>(CDModel.findOne({ name: CD }));

            if(C_Error || !CDM)
            {
                req.flash(`error`, `Unable to find this CD ${CD}`);
                return res.redirect("back");
            }
            
            const dir = DockerDir+"/"+CDM.name;
            
            DockerCompose(dir, CDM.name)
            
            SOCKET.emit(getCDSocketBuild(CDM.name), `Building container`);

            return res.redirect("back");
        });

    }
}