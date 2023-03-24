import React, { ReactNode } from "react";
import styled from "styled-components";

const borderRadius = "5px";
const legendFontSize = "0.9em";

const Box = styled.div`
  display: inline-block;
  position: relative;

  border: 1px solid grey;
  border-radius:  ${borderRadius};

  padding: ${borderRadius};
  padding-top: calc(${borderRadius} + ${legendFontSize} * 0.2);

  margin-top: ${legendFontSize};
`;

const Legend = styled.div`
  position: absolute;
  font-size: ${legendFontSize};
  width: fit-content;

  background-color: white;
  top: calc(-${legendFontSize}*.6);
  left: calc(${legendFontSize}*2);
`;

// Hmm.  This could be improved.  Or would it be better to use fieldset instead?
interface BoxWithLegendProps {
  legend: string;
  children: ReactNode;
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