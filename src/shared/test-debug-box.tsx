import React, { ReactNode } from 'react';
import styled from 'styled-components';

const padding = '5px';
const legendFontSize = '15px';

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

export function TestDebugBox({ children }: { children: ReactNode; }) {
  return (
    <Box>
      <Legend>Test/debug</Legend>
      {children}
    </Box>
  );
}