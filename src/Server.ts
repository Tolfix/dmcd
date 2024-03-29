require("dotenv").config()
import express from "express";
import expressLayout from "express-ejs-layouts";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash"
import cors from "cors";
import compileSass from "node-sass-middleware";
import methodOverride from "method-override";
import log from "./Lib/Logger";
import { PORT, MongoDB_URI, Session_Secret, DebugMode, ConfigMap } from "./Config"
import Auth from "./Passport/Auth";
import MainRouter from "./Routers/Main";
import MongodbEvent from "./Events/Mongodb";
import SocketIo from "./Socket/Sockets";
import ConfigRouter from "./Routers/Config";
import CDRouter from "./Routers/CD";
import WebhookRouter from "./Routers/Webhook";
import SocketHandler from "./Socket/SocketHandler";
import { GenStringBetter } from "./Lib/Generator";
import reCache from "./Setup/reCache";

/**
 * @description
 * The express server
 */
const server = express();

/**
 * @description
 * Connecting to database
 */
mongoose.connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

/**
 * @description
 * Mongoose client;
 */
const db = mongoose.connection;

/**
 * @description
 * Load all mongoose events
 */
MongodbEvent(db);

/**
 * @description
 * Passport local auth
 */
Auth(passport);

server.use(expressLayout);
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(
    compileSass({
        src: process.cwd()+"/Sass", 
        dest: process.cwd()+"/public",
        debug: DebugMode ? true : false,
        outputStyle: 'compressed'
    })
);

server.use(cors({
    origin: true,
    credentials: true
}));

let sessionMiddleWare = session({
    secret: Session_Secret ?? GenStringBetter(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: 24*60*60*1000,
        domain: ConfigMap.get("domain") === "localhost" ? '' : ConfigMap.get("domain"),
        sameSite: ConfigMap.get("domain") === "localhost" ? false : 'strict',
    }
});

server.use(sessionMiddleWare);

server.use(passport.initialize());
server.use(passport.session());

server.use(flash())

server.use(methodOverride('_method'));
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    res.locals.title = ConfigMap.get("title");

    res.locals.isAuth = req.isAuthenticated();

    res.locals.Port = PORT;

    res.locals.Domain = ConfigMap.get("domain");
    res.locals.HTTP = ConfigMap.get("http");
    
    res.setHeader('X-Powered-By', 'Tolfix');

    next();
});

const sv = server.listen(PORT, () => log.info(`Server listing on ${ConfigMap.get("http")}://${ConfigMap.get("domain")}${ConfigMap.get("domain") === "localhost" ? ":"+PORT : ""}/`));
const io = (new SocketIo(sv)).io;

/*
 * All of the routes gets loaded here 
 */
new MainRouter(server);
new ConfigRouter(server);
new CDRouter(server);
new WebhookRouter(server);
    
if(process.platform === "win32" && !DebugMode)
{
    log.error(`Please run this in linux`);
    process.exit(1);
}

/**
 * @description
 * Caches everything
 */
reCache();

const SOCKET = new SocketHandler(io, db);
export default SOCKET