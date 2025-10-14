import { nPostEndPegs, nPreStartPegs, winningLinePos } from "../../config";
import { rowGap } from "./sizes";
import { Position } from "./types";
import { sAssert } from "../../../../utils/assert";

// Make 'raw' peg points for one player.
// 'raw' points do not fit in constraint on coordiated (wherea the final peg point 
// have minimum bottom and left values of 0). 
export function makeRawPegPoints(params: {
    start: Position;
    topArcRadius: number;
    bottomArcRadius: number;
}) : Position[] {
    const { start, topArcRadius, bottomArcRadius } = params;

    const points: Position[] = [];

    // In general lastPoint will be the last point in points. But it can also be the
    // nomimal end point of an arc.
    let lastPoint: Position;

    const addPoint = (pos: Position) => {
        points.push(pos);
        lastPoint = pos;
    };

    const addOffsetPoint = (offset: number) => {
        const { bottom, left } = lastPoint;
        addPoint({ bottom: bottom + offset, left });
    };

    const addArcPoint = (center: Position, radius: number, angle: number) => {
        let { bottom, left } = center;

        bottom += Math.sin(angle) * radius;
        left += -Math.cos(angle) * radius;
        addPoint({ bottom, left });
    };

    const addColumn = (count: number, direction: "up" | "down") => {
        for (let ind = 0; ind < count; ++ind) {
            const sign = direction === "up" ? 1 : -1;
            const gap = (ind % 5 === 0) ? rowGap.fifthRow : rowGap.standard;

            addOffsetPoint(gap * sign);
        }
    };

    const addSimpleArc = (
        center: Position,
        radius: number,
        span: { startAngle: number; endAngle: number; steps: number; }
    ) => {
        const startRad = span.startAngle * (Math.PI / 180);
        const endRad = span.endAngle * (Math.PI / 180);

        const step = (endRad - startRad) / (span.steps - 1);

        for (let ind = 0; ind < span.steps; ++ind) {
            const rad = startRad + step * ind;

            addArcPoint(center, radius, rad);
        }
    };

    const addTopArc = () => {
        const radius = topArcRadius;

        const center = {
            bottom: lastPoint.bottom + rowGap.fifthRow,
            left: lastPoint.left + radius,
        };


        addSimpleArc(center, radius, { startAngle: 10, endAngle: 75, steps: 5 });
        addSimpleArc(center, radius, { startAngle: 105, endAngle: 170, steps: 5 });

        // Set the nominal end point of the arc.
        lastPoint = { bottom: center.bottom, left: center.left + radius };
    };

    const addBottomArc = () => {
        const radius = bottomArcRadius;

        const center = {
            bottom: lastPoint.bottom - rowGap.fifthRow,
            left: lastPoint.left - radius,
        };

        addSimpleArc(center, radius, { startAngle: 195, endAngle: 345, steps: 5 });

        // Set the nominal end point of the arc.
        lastPoint = { bottom: center.bottom, left: center.left - radius };
    };

    // Starting peg points
    sAssert(nPreStartPegs === 2); //kludge
    addPoint(start);
    addOffsetPoint(rowGap.standard);

    // 'In play' pegs
    addColumn(35, "up");

    addTopArc();

    addColumn(35, "down");

    addBottomArc();

    addColumn(35, "up");

    // Finish point
    sAssert(nPostEndPegs === 1); //kludge
    addOffsetPoint(rowGap.fifthRow);

    // Playing points
    sAssert(points.length === nPreStartPegs + winningLinePos + nPostEndPegs); 

    return points;
}
