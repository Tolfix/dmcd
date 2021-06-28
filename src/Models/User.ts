import { Document, model, Schema } from "mongoose"
import { IUser } from "../Interfaces/User";

const UserSchema = new Schema
(
    {

        username: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

    }
);

const User = model<IUser>("users", UserSchema);

export default User;