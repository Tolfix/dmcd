// Gonna make a custom logging system
// ~ Tolfx
import colors from "colors";
import dateFormat from "date-and-time";
import { DebugMode } from "../Config";

const log = {
    trace: trace,

    debug: (body: any, trace = '') => {
        if(DebugMode) {
            let time = getTime();

            console.log(time + " | " + colors.cyan(`debug: ${body}`) 
            //@ts-ignore
            + " ", + trace.length !== '' ? trace : '');
        }
    },

    verbos: (body: any, trace = '') => {
        let time = getTime();

        console.log(time + " | " + colors.magenta(`verbos: ${body}`)
        //@ts-ignore
        + " ", + trace.length !== '' ? trace : '');
    },

    error: (body: any, trace = '') => {
        let time = getTime();

        console.log(time + " | " + colors.red(`error: ${body}`)
        //@ts-ignore
        + " ", + trace.length !== '' ? trace : '');
    },

    warning: (body: any, trace = '') => {
        let time = getTime();

        console.log(time + " | " + colors.yellow(`warning: ${body}`)
        //@ts-ignore
        + " ", + trace.length !== '' ? trace : '');
    },

    info: (body: any, trace = '') => {
        let time = getTime();

        console.log(time + " | " + colors.blue(`info: ${body}`)
        //@ts-ignore
        + " ", + trace.length !== '' ? trace : '');
    },
}

function trace()
{
    var err = new Error();
    let lines = err.stack?.split("\n");
    //@ts-ignore
    return lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1)
}

function getTime() 
{
    const D_CurrentDate = new Date();

    let S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM-DD HH:mm:ss");
    return S_FixedDate;
}

export default log;