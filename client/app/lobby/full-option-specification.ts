import { AppGame, defaultNumPlayers } from '@/app-game-support/app-game';
import { OptionValues } from '@/option-specification/types';
import { sAssert } from '@shared/utils/assert';

export function fullOptionSpecification(game: AppGame, offlineByDefault: boolean) {
  const { minPlayers, maxPlayers } = game;
  const gameOptions = game.options ?? {};

  // The lobby's own options are split into those shown before and after the game's
  // options.
  const before = {
    numPlayers: {
      label: 'Number of players',
      default: defaultNumPlayers(game),
      min: minPlayers,
      max: maxPlayers,
    },
  } as const;

  const after = {
    offline: {
      label: 'Play offline',
      default: offlineByDefault,
      debugOnly: false,
    },

    showDebugOptions: {
      label: 'Show debug options',
      default: false,
    },

    // Control whether the 'show game controls' option is available.
    supportGameControls: {
      label: 'Support game controls',
      default: true,
      debugOnly: true,
    },

    passAndPlay: {
      label: 'Play and pass (offline only)',
      default: true,
      debugOnly: true,
      showIf: (values: OptionValues) => {
        const res = values.offline;
        sAssert(typeof res === 'boolean');
        return res;
      },
    },
  } as const;

  for (const name of Object.keys(gameOptions)) {
    sAssert(
      !(name in before) && !(name in after),
      `Game option '${name}' has the same name as a lobby option`,
    );
  }

  return { ...before, ...gameOptions, ...after };
}
