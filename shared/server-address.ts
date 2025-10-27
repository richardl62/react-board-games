export const serverPort = 8000;

// Hmm, should this be a function?  And is this the right place it?
export function serverAddress(): string {
    
    const url = new URL(window.location.href);
    if (url.hostname === "localhost") {
        url.port = serverPort.toString();
    }

    return url.origin;
}
