import cp from "child_process";

export default function PullImage(image: string): Promise<Boolean>
{
    return new Promise((resolve, reject) => {
        cp.exec(`docker pull ${image}`, (err, stdout, stderr) => {
            console.log(stdout)
            console.log(stderr)
            if(stderr)
            {
                resolve(false);
            }

            if(stdout.includes("Downloaded newer image"))
            {
                resolve(true);
            }
        });
    })

}