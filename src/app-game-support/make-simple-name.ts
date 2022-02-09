
export function makeSimpleName(displayName: string): string {
    return displayName.toLowerCase().replace(/[^a-z0-9]/g, "");
}
