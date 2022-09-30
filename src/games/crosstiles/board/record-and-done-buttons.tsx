import React, { useState } from "react";
import { sAssert } from "../../../utils/assert";
import { sameNestedArray } from "../../../utils/same-nested-array";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { bonusScore } from "../config";

export type RecordRequest = "blockedWithIllegalWords" | "cancelled" | "done";

interface RecordAndDoneButtonsProps {
    /** Called when a record is requested, when a record request is cancelled, or
     * when a record actually occurs. 
     * 
     * Request can be implicitly cancelled by changed the grid. This function
     * is still be call in those case.
     */
    recordRequest: (status: RecordRequest) => void
}

export function RecordAndDoneButtons(props: RecordAndDoneButtonsProps) : JSX.Element {
    const { recordRequest } = props;

    const context = useCrossTilesContext();

    const { grid, rack, playerData, isLegalWord, gridChangeTimestamp, options,
        dispatch, wrappedGameProps: { moves, playerID },  } = context;

    const { gridRackAndScore: recordedGridRackAndScore, scoreCard, 
        doneRecordingGrid } = playerData[playerID];
    const recordedGrid = recordedGridRackAndScore && recordedGridRackAndScore.grid;
    
    sAssert(rack);

    const [blockedRecordTimestamp, setBlockedRecordTimestamp] = useState<number | null>(null);
    const [blockedDoneTimestamp, setBlockedDoneTimestamp] = useState<number | null>(null);

    const currentGridRecorded = recordedGrid && sameNestedArray(recordedGrid, grid);

    // Request confirmation if the grid does not score, unless that option
    // is disabled.
    const onRecordGrid = (status: "unconfirmed" | "confirmed") => {
        const { scoreCategory, score, nBonuses, illegalWords }
            = checkGrid(grid, scoreCard, isLegalWord);

        if (scoreCategory || status === "confirmed" || !options.checkGridBeforeRecoding) {
            const scoreParam = scoreCategory && {
                score,
                category: scoreCategory,
                bonus: nBonuses * bonusScore,
            };
            moves.recordGrid({ grid, rack, score: scoreParam });

            setBlockedRecordTimestamp(null);
            recordRequest("done");
        } else {
            if (illegalWords) {
                recordRequest("blockedWithIllegalWords");
            }

            setBlockedRecordTimestamp(gridChangeTimestamp);
        }
    };

    const onCancelRecord = () => {
        setBlockedRecordTimestamp(null);
        recordRequest("cancelled");
    };

    // Request confirmation if no grid is recorded.
    const onDone = (status: "unconfirmed" | "confirmed") => {
        if (!currentGridRecorded && status === "unconfirmed") {
            setBlockedDoneTimestamp(gridChangeTimestamp);
        } else {
            setBlockedDoneTimestamp(null);
            dispatch({type: "clearClickMoveStart"});

            moves.doneRecordingGrid();
        }
    };

    const onCancelDone = () => {
        setBlockedDoneTimestamp(null);
    };

    if (blockedDoneTimestamp === gridChangeTimestamp) {
        const message = recordedGrid ? "Current grid not recorded " :
            "No grid recorded ";
        return <div>
            <span>{message}</span>
            <button onClick={() => onDone("confirmed")}> Confirm done </button>
            <button onClick={onCancelDone}> Cancel </button>
        </div>;
    }

    if (blockedRecordTimestamp === gridChangeTimestamp) {
        return <div>
            <span>Grid does not score </span>
            <button onClick={() => onRecordGrid("confirmed")}> Confirm record </button>
            <button onClick={onCancelRecord}> Cancel </button>
        </div>;
    }

    const gridChangedMessage = () => {
        if (!recordedGrid) {
            return "No grid recorded";
        }

        if (currentGridRecorded) {
            return "Grid recorded";
        }

        return "Grid changed";
    };

    return <div>
        <button 
            onClick={() => onRecordGrid("unconfirmed")} 
            disabled={doneRecordingGrid}
        >
            Record Grid
        </button>

        <button 
            onClick={() => onDone("unconfirmed")}
            disabled={doneRecordingGrid}
        >
            Done
        </button>

        <span>{gridChangedMessage()}</span>
    </div>;
}
