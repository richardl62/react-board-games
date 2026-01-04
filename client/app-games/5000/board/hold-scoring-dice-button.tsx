import { useMatchState } from "../client-side/match-state";
import { getScores } from "@game-control/games/5000/utils/get-scores";
import { sAssert } from "@utils/assert";

export function HoldScoringDiceButton() {
    const { G, holdAllowed, moves } = useMatchState();
    const { faces, held, options } = G;

    const { unusedFaces: nonScoringFaces } = getScores({
        faces,
        preferSixDiceScore: false,
        allSameScore: options.scoreToWin
    });

    const toHold: boolean[] = Array(held.length).fill(true);

    const unHold = (face: number) => {
        for (let i = held.length - 1; i >= 0; i--) {
            if (toHold[i] && faces[i] === face) {
                toHold[i] = false;
                return;
            }
        }
        sAssert(false, "Could not find face to hold");
    };

    for (const face of nonScoringFaces) {
        unHold(face);
    }

    // Check if hold and toHold are the same
    let same = true;
    for (let i = 0; i < held.length; i++) {
        if (held[i] !== toHold[i]) {
            same = false;
            break;
        }
    }
    return <button
        onClick={() => moves.setHeld(toHold)}
        disabled={same || !holdAllowed}
    >
        Hold Scoring Dice
    </button>;
}
