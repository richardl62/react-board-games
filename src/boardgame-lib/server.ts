/*
    STUB definitions - just enough to get the code to compile.
*/

import { Middleware } from "koa";

function run(_port: number, _callback: () => void) : never {
    console.log("run not implemented");
    throw new Error("run not implemented");
}

function use(_arg0: Middleware) : never {
    console.log("use not implemented");
    throw new Error("use not implemented");
}   

export function Server(_options: unknown)  {
    return {
        run,
        app: {
            use
        }
    };
}   

export const Origins = { LOCALHOST_IN_DEVELOPMENT: "LOCALHOST_IN_DEVELOPMENT" };