import React, {useContext} from 'react';
import { LobbyAccess } from './bgio-tools/lobby-access';


export const LobbyContext = React.createContext<LobbyAccess | null>(null);

export function useLobbyContext() : LobbyAccess {
  const context = useContext(LobbyContext);
  if(!context) {
    throw new Error("Lobby Context is not set");
  }
  return context;
}
// Exports are done inline