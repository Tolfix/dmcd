import cp from "child_process";

export default function PullImage(image: string): Promise<Boolean>
{
    return new Promise((resolve, reject) => {
        
        const ls = cp.spawn('docker', ['pull', image]);

        ls.stdout.on('data', (data) => {
            if(
                data.includes("Downloaded newer image") || 
                data.includes("Image is up to date")
            )
            {
                resolve(true);
            }
        });

        ls.stderr.on('data', (data) => {
            resolve(false)
        });

        ls.on('close', (code) => {
            resolve(true)
        });
    })

}