import { Active, Building, Failed } from "../Types/Statues";

//@ts-nocheck
export function getCDSocketFail<Name extends string>(name: Name): `cd-${Name}-fail`
{
    return `cd-${name}-${Failed}`;
}

export function getCDSocketBuild<Name extends string>(name: Name): `cd-${Name}-building`
{
    return `cd-${name}-${Building}`;
}

export function getCDSocketActive<Name extends string>(name: Name): `cd-${Name}-active`
{
    return `cd-${name}-${Active}`;
}

export function getCDSocketLogs<Name extends string>(name: Name): `cd-${Name}-logs`
{
    return `cd-${name}-logs`;
}