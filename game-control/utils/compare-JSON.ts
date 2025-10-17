export function compareJSON(arg1: unknown, arg2: unknown): number {
    const str1 = JSON.stringify(arg1);
    const str2 = JSON.stringify(arg2);

    if (str1 === str2) {
        return 0;
    } else if (str1 < str2) {
        return -1;
    } else {
        return +1;
    }
}
