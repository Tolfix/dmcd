import { ENV, ICD, PORTS } from "./CD";

export interface ISetupDocker
{
    name: string;
    image: string;
    restartPolicy: "always" | "never" | "on_failure" | "unless_stopped";
    env?: ENV[];
    ports?: PORTS[];
}