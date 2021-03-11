import React, {useContext} from 'react';

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

const defaultOptions : Options = {
  playersPerBrowser: 1,
  bgioDebugPanel: true,
  servers: {game: "", lobby: "",},
  lobbyGame: null,
}

export const OptionsContext = React.createContext<Options>(defaultOptions);


export function useOptionsContext() {
  return useContext(OptionsContext);
}
// Exports are done inline