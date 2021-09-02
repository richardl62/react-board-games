import React from "react";
import styled from "styled-components";
import { Letter, letters } from "./letters";

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
export function LetterSelector({recordSelection} : LetterSelectorProps) {
  return (<StyledLetterChooser>
    {letters.map(l => <div key={l} onClick={()=>recordSelection(l)}>
        {l}
    </div>)}
  </StyledLetterChooser>);
}
