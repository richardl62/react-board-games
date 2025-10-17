function doAssert(
    action: (message: string) => void,
    condition: unknown, message: string | undefined, args: unknown[]) {
    if (!condition) {
        const newMessage = "Assertion failed: " + (message || "<no message>");
        console.log(newMessage, ...args);
        action(newMessage);
    }
}

export function assertThrow(condition: unknown, message?: string,
    ...args: unknown[]): asserts condition {

    const action = (str: string) => {throw new Error(str);};
    doAssert(action, condition, message, args);
}

export function assertAlert(condition: unknown, message?: string,
    ...args: unknown[]): asserts condition {
    doAssert(alert, condition, message, args);
}

export function assertSilent(condition: unknown, message?: string, ...args: unknown[]): asserts condition {
    doAssert(()=>undefined , condition, message, args);
}

// 'sAssert' -> 'standard assert'.
// This name is used rather than 'assert' to destinguish it from other assert 
// functions, e.g. console.assert, and so make it easier to get MS code to 
// automatically import it.
export { assertThrow as sAssert };
