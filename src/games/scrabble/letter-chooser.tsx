import React from "react";
import styled from "styled-components";
import { Letter, letters } from "./letters";

const StyledLetterChooser = styled.div`
  display: inline-flex;
  font-size: 20px;
  * {
    border: 1px solid black;
    background-color: cornsilk;
    width: 20px;
  }
`;

interface LetterChooserProps {
  recordChoosen: (l: Letter) => void
}
export function LetterChooser({recordChoosen} : LetterChooserProps) {
  return (<StyledLetterChooser>
    {letters.map(l => <div onClick={()=>recordChoosen(l)}>
        {l}
    </div>)}
  </StyledLetterChooser>);
}
