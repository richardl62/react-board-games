import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { useDiceRotation } from "./dice-rotation";
import { Dice } from "@/utils/dice/dice";
import { DiceAndButtonsDiv, TwoDiceDiv } from "./styles";
import { GameButtons } from "./game-buttons";

export function TurnControl() : JSX.Element {
    const { G: {diceValues} } = useMatchState();
    
    const diceRotation = useDiceRotation();

    const makeDice = (index: number) => (
        <Dice key={"d" + index} face={diceValues[index]} rotation={diceRotation} color={"darkred"} />
    );


    return <DiceAndButtonsDiv>
        <TwoDiceDiv> {makeDice(0)} {makeDice(1)} </TwoDiceDiv>

        <GameButtons />

        <TwoDiceDiv> {makeDice(2)} {makeDice(3)} </TwoDiceDiv>
    </DiceAndButtonsDiv>;
}

