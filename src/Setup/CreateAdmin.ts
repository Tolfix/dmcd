import mongoose from "mongoose";
import ConfigModel from "../Models/Config";
import User from "../Models/User";
import bcrypt from "bcryptjs"

const myArgs = process.argv.slice(2);

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(myArgs[1], salt, (err, hash) => {

        mongoose.connect(myArgs[0], {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        new ConfigModel({
            setupDone: true,
            title: "DMCD",
            smtp: {
                host: "",
                port: 25,
                secure: false,
                auth: {
                    user: "",
                    password: ""
                },
            },
            domain: "",
        }).save().then(() => {return;});

        new User({
            username: "admin",
            password: hash,
        }).save().then(() => {
            process.exit(0);
        });
    });
});