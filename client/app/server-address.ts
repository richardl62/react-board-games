import { defaultPort } from "@shared/default-port";

export function serverAddress(): string {
    
    // KLUDGE: In development it is convenient to run the client and server on
    // different ports.  This code below helps achieve this, but will lead to
    // (potentially confusing) errors if the server is running on a non-default
    // port on localhost.
    const isLocalhost = window.location.hostname === 'localhost';
    const address = isLocalhost ? 
        `http://localhost:${defaultPort}` : window.location.origin;

    return address;
}
