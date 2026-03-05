import { JSX, useState, useEffect } from "react";
import { useMatchState } from "../match-state/match-state";
import { ScoringOptions } from "./scoring-options";
import { NoOptionRollOrBustButton, ButtonsDiv, RollDontButton, ScoringOptionContainer } from "./styles";

function InnerGameButtons(): JSX.Element {
    const {
        G: { rollCount }, scoringOptions, ctx, playerID, moves, currentlyBlockedColumns,
    } = useMatchState();

    const [selectedScoringOption, setSelectedScoringOption] = useState<number | null>(null);

    useEffect(() => {
        setSelectedScoringOption(null);
    }, [rollCount.total]);

    const movesDisabled = ctx.currentPlayer !== playerID;

    if (rollCount.thisTurn === 0) {
        return <NoOptionRollOrBustButton
            onClick={movesDisabled ? undefined : () => moves.roll()}
        >
            Roll
        </NoOptionRollOrBustButton>;
    }

    if (scoringOptions.length === 0) {
        return <NoOptionRollOrBustButton
            onClick={movesDisabled ? undefined : () => moves.bust()}
        >
            Bust
        </NoOptionRollOrBustButton>;
    }

    const rollDisabled = movesDisabled || selectedScoringOption === null;
    const dontDisabled = movesDisabled || selectedScoringOption === null || currentlyBlockedColumns.length > 0;
    const blockMessage = currentlyBlockedColumns.length > 0 ? `Blocked on col ${currentlyBlockedColumns.join(", ")}` : "";
    return <>
        <RollDontButton
            onClick={() => moves.roll()}
            disabled={rollDisabled}
        >
            Roll
        </RollDontButton>

        <ScoringOptionContainer>
            <ScoringOptions
                selectedScoringOption={selectedScoringOption}
                setSelectedScoringOption={setSelectedScoringOption} />
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
