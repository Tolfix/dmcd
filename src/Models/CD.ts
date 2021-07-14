import { model, Schema, Document } from "mongoose"
import { ICD, IDCD } from "../Interfaces/CD";

const CDSchema = new Schema
(
    {

        name: {
            type: String,
            required: true,
            unique: true,
        },

        image: {
            type: String,
            required: true
        },

        env: {
            type: Array,
            required: false
        },

        ports: {
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

        logs: {
            type: Array,
            default: [],
        },

        email: {
            type: Boolean,
            default: false
        },

    }
);

const CDModel = model<IDCD>("cd", CDSchema);

export default CDModel;