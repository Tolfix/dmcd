export function env_seperator(env: string)
{
    let value, name;
    let indexOfName = 0;

    for(let char of env)
    {
        if(char === "=")
            break;
        indexOfName++;
    }

    value = env.slice(indexOfName+1);
    name = env.slice(0, indexOfName)

    return {
        value,
        name
    }
}