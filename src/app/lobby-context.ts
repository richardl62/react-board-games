import React, {useContext} from 'react';
import { Servers } from './types';

const defaultOptions = {
  servers: {game: "", lobby: "",},
  lobbyGame: null,
}

interface OptionsContexttType {
  servers: Servers;
  lobbyGame: string | null;
};

export const OptionsContextt = React.createContext<OptionsContexttType>(defaultOptions);

export function useOptionsContextt() {
  return useContext(OptionsContextt);
}
// Exports are done inline