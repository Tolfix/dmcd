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
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            resolve(false)
            console.error(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            resolve(true)
        });
    })

}