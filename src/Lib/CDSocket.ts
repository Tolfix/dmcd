//@ts-nocheck
export function getCDSocketFail<Name extends string>(name: Name): `cd-${Name}-fail`
{
    return `cd-${name}-fail`;
}

export function getCDSocketBuild<Name extends string>(name: Name): `cd-${Name}-building`
{
    return `cd-${name}-building`;
}

export function getCDSocketActive<Name extends string>(name: Name): `cd-${Name}-active`
{
    return `cd-${name}-active`;
}

export function getCDSocketLogs<Name extends string>(name: Name): `cd-${Name}-logs`
{
    return `cd-${name}-logs`;
}