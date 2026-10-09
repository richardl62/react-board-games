import { JSX, ReactNode, useState } from 'react';
import styled from 'styled-components';

const OuterDiv = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
`;

const ToggleLabel = styled.label`
  opacity: 0.7;
`;

const ControlsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
`;

// An unobtrusive checkbox which reveals controls that affect the match as a whole
// (e.g. proposing a rematch) rather than individual moves. The controls are hidden
// by default to reduce clutter and the risk of accidental use.
export function GameControls({ children }: { children: ReactNode }): JSX.Element {
  const [show, setShow] = useState(false);

  return (
    <OuterDiv>
      <ToggleLabel>
        <input type="checkbox" checked={show} onChange={() => setShow(!show)} />
        Show game controls
      </ToggleLabel>
      {show && <ControlsDiv>{children}</ControlsDiv>}
    </OuterDiv>
  );
}
