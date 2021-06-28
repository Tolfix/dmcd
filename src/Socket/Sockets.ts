import { Server } from "socket.io";
import { Server as HttpServer } from "http"
export default class SocketIo
{
    private server: HttpServer;
    public io: Server

    constructor(server: HttpServer)
    {
        this.server = server;
        this.io = new Server(server);
    }
}