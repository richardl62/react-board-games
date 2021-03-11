import { Servers } from '../types';

export class LobbyAccess {
  constructor(servers: Servers, activeGame: string | null) {
    this.servers = servers;
    this.activeGame = activeGame;
  }
  readonly servers: Servers;
  readonly activeGame: string | null;
}
