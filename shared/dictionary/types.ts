export interface DictionaryLookupResult {
  definition: string | null;
  // Set when the definition is actually for a different headword than the
  // word that was looked up, e.g. looking up "happiest" returns the
  // definition for "happy". Presentation (e.g. "Derived from happy: ...")
  // is left to the caller.
  baseWord?: string;
}
