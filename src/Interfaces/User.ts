import { Document, model, Schema } from "mongoose"

export interface IUser extends Document 
{
    username: string;
    password: string;
    id: string;
}