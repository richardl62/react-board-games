import React, { ReactNode } from "react";
import styled from "styled-components";

const padding = "5px";
const legendFontSize = "15px";

const Box = styled.div`
  position: relative;
  border: 1px dashed black;
  border-radius: 5px;
  margin-top: 10px;
  padding: ${padding};
`;

const Legend = styled.div`
  font-size: ${legendFontSize};
  width: fit-content;
  position: inherit;
  background-color: white;
  top: calc(-${padding} - (${legendFontSize}*.6));
  left: 30px;
`;

// Hmm.  This could be improved.  Or would it be better to use fieldset instead?
interface BoxWithLegendProps {
  legend: string;
  children: ReactNode
}
export function BoxWithLegend(props: BoxWithLegendProps): JSX.Element {
    const { legend, children } = props;
    return (
        <Box>
            <Legend>{legend}</Legend>
            {children}
        </Box>
    );
}