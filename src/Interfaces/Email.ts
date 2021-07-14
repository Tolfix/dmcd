export interface IBodyEmail
{
    isHTML: boolean;
    body: any
}

export interface IEmail
{
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}