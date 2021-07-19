import { ENV, PORTS } from "./CD";

export interface ICreateDockerCompose
{
    name: string;
    image: string;
    restartPolicy: "always" | "never" | "on_failure" | "unless_stopped";
    env?: ENV[];
    ports?: PORTS[];
    volumes?: Volume[];
    binds?: Bind[];
}

export interface Volume
{
    name: string;
    path: string;
}

export interface Bind
{
    host: string;
    container: string;
}