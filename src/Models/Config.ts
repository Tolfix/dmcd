import { model, Schema } from "mongoose"
import { IConfig } from "../Interfaces/Config";

const ConfigSchema = new Schema
(
    {

        setupDone: {
            type: Boolean,
        },

        title: {
            type: String,
        },

        smtp: {
            type: Object
        },

        domain: {
            type: String,
        },

    }
);

const ConfigModel = model<IConfig>("config", ConfigSchema);

export default ConfigModel;