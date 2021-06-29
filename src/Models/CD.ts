import { model, Schema, Document } from "mongoose"
import { ICD } from "../Interfaces/CD";

const CDSchema = new Schema
(
    {

        name: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        env: {
            type: Array,
            required: false
        },

        restartPolicy: {
            type: String,
            default: "always"
        },

        webhookUrl: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "active"
        },

    }
);

interface b extends ICD, Document {};

const CDModel = model<b>("cd", CDSchema);

export default CDModel;