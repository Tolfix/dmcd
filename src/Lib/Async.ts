/**
 * @description
 * Used for async code, to skip `.catch` or `try {...}`
 * @async
 * ```ts
 * const [Returns, ReturnsError] = await AW(Promise.resolve("hello"));
 * ```
 */
export default async function 
    AW<P>(data: Promise<P> extends P ? P extends P ? any : Promise<P extends P ? P : any> : any)
        : Promise<[P | null, PromiseRejectedResult | null]>
{
    try
    {
        return [await data, null];
    } catch (e)
    {
        return [null, e as PromiseRejectedResult];
    }
}