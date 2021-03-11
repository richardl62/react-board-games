
export interface Servers {
  game: string;
  lobby: string;
}

export interface Options {
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
  servers: Servers;
  lobbyGame: string | null;
}
