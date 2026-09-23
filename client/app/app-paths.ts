import { AppGame } from '@/app-game-support/app-game';

// Paths (relative to the router's basename) of the app's pages.

export function gamePath(game: AppGame): string {
  return '/' + game.name;
}

export const pastGamesPath = '/past-games';
