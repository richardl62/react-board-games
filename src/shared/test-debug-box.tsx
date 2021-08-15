import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  position: relative;
  border: 1px dashed black;
  border-radius: 5px;
  margin-top: 20px;
`;

const Legend = styled.div`
  width: fit-content;
  position: inherit;
  background-color: white;
  top: -10px;
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