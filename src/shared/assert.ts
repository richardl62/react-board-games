

function doAssert(
    action: (message: string) => void,
    condition: any, message: string | undefined, args: any[]) {
    if (!condition) {
        const newMessage = "Assertion failed: " + (message || '<no message>');
        console.log(newMessage, ...args);
        debugger;
        action(newMessage);
    }
}

export function assertThrow(condition: any, message?: string,
    ...args: any[]): asserts condition {

    const action = (str: string) => {throw new Error(str)};
    doAssert(action, condition, message, args);
}

export function assertAlert(condition: any, message?: string,
    ...args: any[]): asserts condition {
    doAssert(alert, condition, message, args);
}

export function assertSilent(condition: any, message?: string,
    ...args: any[]): asserts condition {
    doAssert((arg:string)=>{} , condition, message, args);
}

// 'gAssert' -> 'general assert' or 'game assert' or something.
// This name is used rather than 'assert' to destinguish it from standard assert
// functions, and imparticular to make it easier to get MS code to import it.
export { assertThrow as gAssert };
