export function env_seperator
<Key extends string = string, Value extends string = string>
(env: string): { value: Value, name: Key }
{
    let value: Value, name: Key;
    let indexOfName = 0;

    for(let char of env)
    {
        if(char === "=")
            break;
        indexOfName++;
    }

    value = env.slice(indexOfName+1) as Value;
    name = env.slice(0, indexOfName) as Key;

    return {
        value,
        name
    }
}