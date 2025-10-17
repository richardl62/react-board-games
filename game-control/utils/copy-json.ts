export function copyJSON<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
