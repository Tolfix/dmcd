export function getCDSocketFail(name: string): string
{
    return `cd-${name}-fail`;
}

export function getCDSocketBuild(name: string): string
{
    return `cd-${name}-building`;
}

export function getCDSocketActive(name: string): string
{
    return `cd-${name}-active`;
}