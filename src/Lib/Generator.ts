import crypto from "crypto"

export async function GenString(length: number = 10): Promise<string>
{
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buf) => {
            if (err) {
                return reject(err);
            };

            return resolve(buf.toString('hex'));
        });
    });
}