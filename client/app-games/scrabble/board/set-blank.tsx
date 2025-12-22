import { JSX, useState } from "react";
import styled from "styled-components";
import { Letter, letters } from "@game-control/games/scrabble/config/letters";
import { useTurnControlData } from "./use-turn-control-data";
import { useScrabbleContext } from "../client-side/scrabble-context";

const StyledLetterChooser = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(8, 25px);
  font-size: 20px;
  * {
    margin-bottom: -2px;
    margin-right: -2px;
    border: 2px black solid;

    text-align: center;
    background-color: cornsilk;
  }
`;

interface LetterSelectorProps {
  recordSelection: (l: Letter) => void
}
function LetterSelector({recordSelection} : LetterSelectorProps): JSX.Element {
    return (<StyledLetterChooser>
        {letters.map(l => <div key={l} onClick={()=>recordSelection(l)}>
            {l}
        </div>)}
    </StyledLetterChooser>);
}

export function SetBlank(): JSX.Element | null {
    const { unsetBlank } = useTurnControlData();
    const { dispatch } = useScrabbleContext();
    const [ showLetterSelector, setShowLetterSelector] = useState(false);
    
    if (!unsetBlank) {
        return null;
    }

    const recordSelectedLetter = (l: Letter) => {
        dispatch({ type: "setBlank", data: { id: unsetBlank, letter: l } });
        setShowLetterSelector(false);
    };

    return showLetterSelector ?
        <LetterSelector recordSelection={recordSelectedLetter}/> :
        <button onClick={() => setShowLetterSelector(true)}>Set Blank</button>; 
}
