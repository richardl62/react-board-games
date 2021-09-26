function doAssert(
    action: (message: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: any, message: string | undefined, args: any[]) {
    if (!condition) {
        const newMessage = "Assertion failed: " + (message || '<no message>');
        console.log(newMessage, ...args);
        action(newMessage);
    }
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function assertThrow(condition: any, message?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]): asserts condition {

    const action = (str: string) => {throw new Error(str)};
    doAssert(action, condition, message, args);
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function assertAlert(condition: any, message?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]): asserts condition {
    doAssert(alert, condition, message, args);
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function assertSilent(condition: any, message?: string, ...args: any[]): asserts condition {
    doAssert(()=>undefined , condition, message, args);
}

// 'sAssert' -> 'standard assert'.
// This name is used rather than 'assert' to destinguish it from other assert 
// functions, e.g. console.assert, and so make it easier to get MS code to 
// automatically import it.
export { assertThrow as sAssert };
