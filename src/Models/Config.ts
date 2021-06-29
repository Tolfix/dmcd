import { model, Schema } from "mongoose"
import { IConfig } from "../Interfaces/Config";

const ConfigSchema = new Schema
(
    {

        setupDone: {
            type: Boolean,
        },

    }
);

const ConfigModel = model<IConfig>("users", ConfigSchema);

export default ConfigModel;