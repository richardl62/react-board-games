import { makeRawPegPoints } from "./raw-peg-points";
import { acrRadiusTop, columnGap, holeRadius } from "./sizes";
import { Position } from "./types";

interface PegPoints {
    player1: Position[];
    player2: Position[];
}

function makeBoundingBox(points: Position[]) {

    let minBottom = points[0].bottom;
    let maxBottom = minBottom;

    let minLeft = points[0].left;
    let maxLeft = minLeft;

    for(const pos of points) {
        minBottom = Math.min(minBottom, pos.bottom);
        maxBottom = Math.max(maxBottom, pos.bottom);

        minLeft = Math.min(minLeft, pos.left);
        maxLeft = Math.max(maxLeft, pos.left);
    }

    return {minBottom, maxBottom, minLeft, maxLeft};
}

// Add the cordinated in offset to each of the points in points.
function offsetPoints(points: Position[], offset: Position) {
    return points.map(pos => {
        return {
            bottom: pos.bottom + offset.bottom,
            left: pos.left + offset.left,
        };
    });
}

const rawPegPoints: PegPoints = {
    player1: makeRawPegPoints({
        start: {bottom:0, left:0},
        topArcRadius: acrRadiusTop + columnGap/2,
        bottomArcRadius: acrRadiusTop/2 + columnGap/2,
    }),

    player2: makeRawPegPoints({
        start: {bottom:0, left: columnGap},
        topArcRadius: acrRadiusTop - columnGap/2,
        bottomArcRadius: acrRadiusTop/2 - columnGap/2,
    }),
};

const rawBoundingBox = makeBoundingBox(
    [...rawPegPoints.player1, ...rawPegPoints.player2]
);

export const boardWidth = (rawBoundingBox.maxLeft - rawBoundingBox.minLeft) + holeRadius;
export const boardHeight = (rawBoundingBox.maxBottom - rawBoundingBox.minBottom) + holeRadius;

const offset = {
    bottom: -rawBoundingBox.minBottom,
    left: -rawBoundingBox.minLeft,
};

export const pegPoints: PegPoints = {
    player1: offsetPoints(rawPegPoints.player1, offset),
    player2: offsetPoints(rawPegPoints.player2, offset),
};
