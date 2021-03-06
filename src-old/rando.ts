/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// random stuff for stuff idk

import { MessageEmbed } from "discord.js";
import { JsonConvert, JsonObject, JsonProperty } from "json2typescript";
// import { transports } from "winston";
// import { Logger } from "winston";
// import { format } from "winston";
// import { createLogger } from "winston";
import { devloglevel, prodloglevel, labelshift, levelshift, colours } from "./consts";

/**
 * right pad until specified length, if longer then specified length then not modified
 *
 * @param str string to right pad
 * @param shift target length
 * @returns padded string
 */
export function normalise(str: string, shift: number): string {
   for (let i: number = str.length; i <= shift; i++) str = str + " ";
   return str;
}

/**
 * check if process.env.NODE_ENV is "prod" or "production"
 * @returns if env considered production
 */
export function envisprod(): boolean {
   return process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";
}

/**
 * check if process.env.NODE_ENV is NOT "prod" or "production", since if it
 * isn't production its development lol
 * @returns if env considered development
 */
export function envisdev(): boolean {
   return !envisprod();
}

// /**
//  * gets a configured winston.Logger
//  *
//  * @param label label to use in logger
//  * @returns the logger
//  */
// export function getlogger(label: string): Logger {
//    return createLogger({
//       level: envisprod() ? prodloglevel : devloglevel,
//       transports: [new transports.Console],
//       format: format.combine(
//          format.timestamp(),
//          format.label({ label: `[${label}]`, message: false }),
//          format.printf(info => {
//             return `${info.timestamp} ${normalise(info.label, labelshift)} ${normalise(`[${info.level}]`, levelshift)} ${info.message}`;
//          })
//       ),
//       levels: {
//          emerg: 0,
//          alert: 1,
//          crit: 2,
//          error: 3,
//          warning: 4,
//          notice: 5,
//          info: 6,
//          debug: 7
//       }
//    });
// }

// const logger: Logger = getlogger("_rando");

// i hope i got this right lol
// i must find an official one from like node or something, this is too fragile
/** weird type used for AutumnBlaze.registerstoplistener (yea ik this is bad lol) */
export type ProcessEvents = "SIGABRT"
| "SIGALRM"
| "SIGBREAK"
| "SIGBUS"
| "SIGCHLD"
| "SIGCONT"
| "SIGFPE"
| "SIGHUP"
| "SIGILL"
| "SIGINFO"
| "SIGINT"
| "SIGIO"
| "SIGIOT"
| "SIGKILL"
| "SIGLOST"
| "SIGPIPE"
| "SIGPOLL"
| "SIGPROF"
| "SIGPWR"
| "SIGQUIT"
| "SIGSEGV"
| "SIGSTKFLT"
| "SIGSTOP"
| "SIGSYS"
| "SIGTERM"
| "SIGTRAP"
| "SIGTSTP"
| "SIGTTIN"
| "SIGTTOU"
| "SIGUNUSED"
| "SIGURG"
| "SIGUSR1"
| "SIGUSR2"
| "SIGVTALRM"
| "SIGWINCH"
| "SIGXCPU"
| "SIGXFSZ"
| "beforeExit"
| "disconnect"
| "exit"
| "message"
| "multipleResolves"
| "newListener"
| "rejectionHandled"
| "removeListener"
| "uncaughtException"
| "uncaughtExceptionMonitor"
| "unhandledRejection"
| "warning";

/** chops prefix off the front of a command string */
export function chopprefix(prefix: string, messagecontent: string): string | false {
   if (messagecontent.toLowerCase().startsWith(prefix.toLowerCase())) return messagecontent.substring(prefix.length);
   return false;
}

/** chops next "arg" from a command stringstring */
export function getnextarg(messagecontent: string): [string, string] {
   const spacelocation: number = messagecontent.indexOf(" ");
   if (spacelocation === -1) return [messagecontent, ""];
   return [
      messagecontent.substring(0, spacelocation),
      messagecontent.substring(spacelocation + 1)
   ];
}

/** does nothing useful except yeet (throw) something that you put into it */
export function yeet(err: any): void {
   throw err;
}

/**
 * await this, itll resolve in this much millis
 *
 * @param ms milliseconds to wait
 * @returns promise that will resolve in specified time
 */
export async function wait(ms: number): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, ms));
}

/** json2typescript class to get package.json information */
@JsonObject("packagejson") export class PackageJson {
   // put as optional because i dont want it to crash just because it doesn't know its version
   @JsonProperty("version", String, true) public version: string = "unknwon";
}

/** package.json important information */
export const packagejson: PackageJson = new JsonConvert().deserializeObject(require("../package.json"), PackageJson);

/**
 * put in any amount of arrays, this method will get a random number between 0 and firstarray.length - 1,
 * and return an array with that numbered element from each of the arrays.
 *
 * Example:
 * ```typescript
 * // input arrays
 * const arr1: Array<string> = ["a1", "a2", "a3", "a4", "a5"];
 * const arr2: Array<string> = ["b1", "b2", "b3", "b4", "b5"];
 * const arr3: Array<string> = ["c1", "c2", "c3", "c4", "c5"];
 * const arr4: Array<string> = ["d1", "d2", "d3", "d4", "d5"];
 * const arr5: Array<string> = ["e1", "e2", "e3", "e4", "e5"];
 *
 * // random number, this is actually random but manually set for demonstration
 * const randnum: number = 2;
 *
 * // call method like so
 * randfromarray<string>(arr1, arr2, arr3, arr4, arr5);
 * // returns ["a3", "b3", "c3", "d3", "e3"]
 * ```
 *
 * @param arrs arrays (should be all the same length) to get random from
 * @returns array of elements picked from arrays (length is equal to amount of arrays passed in)
 */
export function randfromarray<T>(...arrs: ReadonlyArray<ReadonlyArray<T>>): Array<T> {
   if (arrs.length === 0) return [];

   const randnum: number = Math.floor(Math.random() * arrs[0].length);
   const randarr: Array<T> = [];
   for (const arr of arrs) if (arr.length > randnum) randarr.push(arr[randnum]);

   return randarr;
}

/** get a standard embed with standard fields already filled in */
export function getembed(): MessageEmbed {
   return new MessageEmbed()
      .setColor(randfromarray(colours)[0])
      .setFooter("autumnblaze v" + packagejson.version);
}
