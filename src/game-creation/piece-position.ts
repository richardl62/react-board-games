export interface RowCol {
    row: number;
    col: number;
};

interface BoardPosition {
    row: number;
    col: number;
    top?: never;
    bottom?: never;
}

interface OffBoardPositionTop {
    row?: never;
    col?: never;
    top: number;
    bottom?: never;
}

interface OffBoardPositionBottom {
    row?: never;
    col?: never;
    top?: never;
    bottom: number;
}

export type PiecePosition = 
    BoardPosition | OffBoardPositionTop | OffBoardPositionBottom;

interface MakePiecePositionInput {
    row?: number;
    col?: number;

    top?: number;
    bottom?: number;
}

export function makePiecePosition(data: MakePiecePositionInput): PiecePosition {
    if (data.row !== undefined && data.col !== undefined) {
        return { row: data.row, col: data.col };
    }

    if (data.top !== undefined) {
        return { top: data.top };
    }

    if (data.bottom !== undefined) {
        return { bottom: data.bottom };
    }

    throw new Error("Bad input data to makePiecePosition");
}

export function samePiecePosition(
    p1: PiecePosition,
    p2: PiecePosition,
) {
    return p1.row === p2.row
        && p1.col === p2.col
        && p1.top === p2.top
        && p1.bottom === p2.bottom;
}

// Exports are done inline
