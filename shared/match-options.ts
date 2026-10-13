// Options that apply to a match whatever the game (c.f. the setup data for a
// particular game). They are chosen when the match is created and are fixed for the
// lifetime of the match, including any rematches.
//
// To add an option: add it here, to isMatchOptions and to the client's
// matchOptionSpecification.
export interface MatchOptions {
  // Whether the 'show game controls' option is available.
  readonly supportGameControls: boolean;
}

export function isMatchOptions(obj: unknown): obj is MatchOptions {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as MatchOptions;
  return typeof candidate.supportGameControls === 'boolean';
}
