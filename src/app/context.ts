import React, {useContext} from 'react';
import { Options } from './types';

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