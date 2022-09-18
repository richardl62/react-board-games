export function sAssert(condition: unknown, message?: string,
    ...args: unknown[]): asserts condition {

    if (!condition) {
        const newMessage = "Assertion failed: " + (message || "<no message>");

        console.log(newMessage, ...args);
        throw new Error(newMessage);
    }
}
