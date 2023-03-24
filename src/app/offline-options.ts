export interface OfflineOptions {
    numPlayers: number;
    debugPanel: boolean;
    // KLUDGE? An empty object (rather than null) is used when there is no
    // setup data.
    setupData: {[key: string]: number|boolean};
}
