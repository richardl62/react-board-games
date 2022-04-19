interface RackID {
    row?: undefined,
    col: number,
    container: "rack";
}

export interface GridID {
    row: number,
    col: number,
    container: "grid";
}

export type SquareID = RackID | GridID;