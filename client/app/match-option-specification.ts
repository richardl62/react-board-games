import { OptionSpecifications, SpecifiedValues } from '@/option-specification/types';
import { MatchOptions } from '@shared/match-options';
import { assertType, Equal } from '@utils/assert-type';

// How the match options (see MatchOptions) are presented in the lobby, and their
// default values.
export const matchOptionSpecification = {
  supportGameControls: {
    label: 'Support game controls',
    default: true,
    debugOnly: true,
  },
} as const satisfies OptionSpecifications;

assertType<Equal<MatchOptions, SpecifiedValues<typeof matchOptionSpecification>>>();
