import { AppGame } from '@/app-game-support/app-game';
import { OptionSpecifications, SpecifiedValues } from '@/option-specification/types';
import { MatchOptions } from '@shared/match-options';
import { assertType, Equal } from '@utils/assert-type';

// How the match options (see MatchOptions) are presented in the lobby, and their
// default values for the given game.
export function matchOptionSpecification(game: AppGame) {
  return {
    supportGameControls: {
      label: 'Support game controls',
      default: game.supportGameControlsDefault,
      debugOnly: true,
    },
  } as const satisfies OptionSpecifications;
}

assertType<Equal<MatchOptions, SpecifiedValues<ReturnType<typeof matchOptionSpecification>>>>();
