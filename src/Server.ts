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
import { PORT, Web_Title, MongoDB_URI, Domain, Session_Secret, DebugMode, HTTPS } from "./Config"
import Auth from "./Passport/Auth";
import MainRouter from "./Routers/Main";
import MongodbEvent from "./Events/Mongodb";
import SocketIo from "./Socket/Sockets";
import ConfigRouter from "./Routers/Config";
import CDRouter from "./Routers/CD";
import WebhookRouter from "./Routers/Webhook";
import SocketHandler from "./Socket/SocketHandler";
import { GenString, GenStringBetter } from "./Lib/Generator";

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
        domain: Domain === "localhost" ? '' : Domain,
        sameSite: Domain === "localhost" ? false : 'strict',
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

    res.locals.title = Web_Title;

    res.locals.isAuth = req.isAuthenticated();

    res.locals.Port = PORT;

    res.locals.Domain = Domain;
    res.locals.HTTP = HTTPS;
    
    res.setHeader('X-Powered-By', 'Tolfix');

    next();
});

const sv = server.listen(PORT, () => log.info(`Server listing on ${HTTPS}://${Domain}${Domain === "localhost" ? ":"+PORT : ""}/`));
const io = (new SocketIo(sv)).io;

new MainRouter(server);
new ConfigRouter(server);
new CDRouter(server);
new WebhookRouter(server);
    
if(process.platform === "win32" && !DebugMode)
{
    log.error(`Please run this in linux`);
    process.exit(1);
}

const SOCKET = new SocketHandler(io, db);
export default SOCKET