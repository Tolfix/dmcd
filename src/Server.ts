require("dotenv").config()
import express from "express";
import expressLayout from "express-ejs-layouts";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash"
import cors from "cors";
import methodOverride from "method-override";
import log from "./Lib/Logger";
import { PORT, Web_Title, MongoDB_URI, Domain, Session_Secret, DebugMode } from "./Config"
import Auth from "./Passport/Auth";
import MainRouter from "./Routers/Main";
import MongodbEvent from "./Events/Mongodb";
import { Server } from "http"
import SocketIo from "./Socket/Sockets";
import ConfigRouter from "./Routers/Config";
import CDRouter from "./Routers/CD";
import WebhookRouter from "./Routers/Webhook";

const server = express();

mongoose.connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;

MongodbEvent(db);
Auth(passport);

server.use(expressLayout);
server.set('view engine', 'ejs');
server.use(express.static('public'));

server.use(cors({
    origin: true,
    credentials: true
}));

let sessionMiddleWare = session({
    secret: Session_Secret ?? "uhm yes, not so secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: 24*60*60*1000,
        domain: Domain ?? '',
        // sameSite: is_prod ? 'strict' : false,
    }
});

server.use(sessionMiddleWare);

server.use(passport.initialize());
server.use(passport.session());

server.use(flash())

server.use(methodOverride('_method'));
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    res.locals.title = Web_Title;

    res.locals.isAuth = req.isAuthenticated();

    res.locals.Port = PORT;
    
    res.setHeader('X-Powered-By', 'Tolfix');

    next();
});

const sv = server.listen(PORT, () => log.info(`Server listing on http://localhost:${PORT}/`));
export const io = (new SocketIo(sv)).io;

new MainRouter(server, io);
new ConfigRouter(server, io);
new CDRouter(server, io);
new WebhookRouter(server, io);
    
if(process.platform === "win32" && !DebugMode)
{
    log.error(`Please run this in linux`);
    process.exit(1);
}