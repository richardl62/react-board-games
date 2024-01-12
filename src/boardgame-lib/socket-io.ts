//export { SocketIO } from "boardgame.io/multiplayer";

export function SocketIO({ server }: { server: string }): never {
    console.log("SocketIO", server);
    throw new Error("SocketIO is not implemented");
}
