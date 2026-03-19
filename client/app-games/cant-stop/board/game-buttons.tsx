import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { ScoringOptions } from "./scoring-options";
import { NoOptionRollOrBustButton, ButtonsDiv, RollDontButton, ScoringOptionContainer } from "./styles2";

function InnerGameButtons(): JSX.Element {
    const {
        G: { scoringChoice },  ctx, playerID, moves, currentlyBlockedColumns,
    } = useMatchState();


    const movesDisabled = ctx.currentPlayer !== playerID;

    if (scoringChoice === "rollRequired") {
        return <NoOptionRollOrBustButton
            onClick={movesDisabled ? undefined : () => moves.roll()}
        >
            Roll
        </NoOptionRollOrBustButton>
    }

    if (scoringChoice === "bust") {
        return <NoOptionRollOrBustButton
            onClick={movesDisabled ? undefined : () => moves.acknowledgeBust()}
        >
            Bust
        </NoOptionRollOrBustButton>;
    }

    const scoreSelected = typeof scoringChoice === "number";
    const rollDisabled = movesDisabled || !scoreSelected;
    const dontDisabled = movesDisabled || !scoreSelected || currentlyBlockedColumns.length > 0;

    const blockMessage = currentlyBlockedColumns.length > 0 ? `Blocked on col ${currentlyBlockedColumns.join(", ")}` : "";
    return <>
        <RollDontButton
            onClick={() => moves.roll()}
            disabled={rollDisabled}
        >
            Roll
        </RollDontButton>

        <ScoringOptionContainer>
            <ScoringOptions />
            <div>{blockMessage}</div>
        </ScoringOptionContainer>

        <RollDontButton
            onClick={() => moves.stopRolling()}
            disabled={dontDisabled}
        >
            Don't
        </RollDontButton>
    </>;
}

export function GameButtons(): JSX.Element {
    return <ButtonsDiv>
        <InnerGameButtons />
    </ButtonsDiv>;
}
