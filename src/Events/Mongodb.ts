import log from "../Lib/Logger";
import mongoose from "mongoose";

export default function MongodbEvent(db: mongoose.Connection)
{
    db.on('error', (error: any) => {
        log.error(error)
        // log.error(`Closing application.. cannot run without mongoDB.`, log.trace())
        // process.exit(1);
    });

    db.on('disconnected', () => {
        log.error(`Got disconneted by mongoDB database..`, log.trace())
        log.error(`Closing application.. cannot run without mongoDB.`, log.trace())
        process.exit(1);
    })

    db.once('open', () => {
        log.info("Connected to database");
    });
}