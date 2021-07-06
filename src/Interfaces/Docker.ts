import { ENV, PORTS } from "./CD";

export interface ICreateDockerCompose
{
    name: string;
    image: string;
    restartPolicy: "always" | "never" | "on_failure" | "unless_stopped";
    env?: ENV[];
    ports?: PORTS[];
}