import { Document, model, Schema } from "mongoose"

export interface IConfig extends Document
{
    setupDone: Boolean;
}