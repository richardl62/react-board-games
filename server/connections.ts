import WebSocket from "ws";


export class Connections {

    connection(_ws: WebSocket, _requestUrl: string | undefined) {
        console.log('Connection established');
        throw new Error("Method not implemented.");
    }

    message(_ws: WebSocket, _str: string) {
        throw new Error("Method not implemented.");
    }

    close(_ws: WebSocket) {
        console.log('Connection closed');
        throw new Error("Method not implemented.");
    }

    error(_ws: WebSocket, error: Error) {
        // What should be done here?
        console.error('WebSocket error:', error);
        throw new Error("Method not implemented.");
    }
}