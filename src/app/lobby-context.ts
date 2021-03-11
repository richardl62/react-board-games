import React, {useContext} from 'react';
import { Servers } from './types';

export class LobbyAccess {
  constructor(servers: Servers, activeGame: string | null) {
    this.servers = servers;
    this.activeGame = activeGame;
  }
  readonly servers : Servers;
  readonly activeGame: string | null;
}

export const LobbyContext = React.createContext<LobbyAccess | null>(null);

export function useLobbyContext() : LobbyAccess {
  const context = useContext(LobbyContext);
  if(!context) {
    throw new Error("Lobby Context is not set");
  }
  return context;
}
// Exports are done inline