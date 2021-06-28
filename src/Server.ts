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
import { PORT, Web_Title, MongoDB_URI, Domain, Session_Secret } from "./Config"
import Auth from "./Passport/Auth";
import MainRouter from "./Routers/Main";
import MongodbEvent from "./Events/Mongodb";
import { Server } from "http"
import SocketIo from "./Socket/Sockets";

const server = express();
const httpServer = new Server(server)
const io = (new SocketIo(httpServer)).io;

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
    
    res.setHeader('X-Powered-By', 'Tolfix');

    next();
});

new MainRouter(server, io);
    
server.listen(PORT, () => log.info(`Server listing on port: ${PORT}`, log.trace()));