import React, {useContext} from 'react';
import { LobbyClient } from './bgio-tools';


export const LobbyContext = React.createContext<LobbyClient | null>(null);

export function useLobbyContext() : LobbyClient {
  const context = useContext(LobbyContext);
  if(!context) {
    throw new Error("Lobby Context is not set");
  }
  return context;
}
// Exports are done inline