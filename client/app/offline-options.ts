import { OptionValues } from '@/option-specification/types';

// Options for an offline match. Set from the lobby (StartNewMatch) or the URL,
// held in GamePage state and consumed by OfflineMatch.
export interface OfflineOptions {
  numPlayers: number;
  passAndPlay: boolean;

  // Values for the game's own options (empty if the game has none).
  setupData: OptionValues;
}
