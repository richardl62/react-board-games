import { ChangeEvent, JSX, useState } from 'react';
import styled from 'styled-components';
import { ServerConnection } from './use-server-connection';

const OuterDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  min-width: 12rem;
  text-align: right;
  margin-right: 0.1rem;
`;

const NumberInput = styled.input`
  width: 6rem;
  margin-right: 0.3rem;
`;

// Extra options for use in debug mode.
export function DebugModeActions({
  serverConnection,
}: {
  serverConnection: ServerConnection;
}): JSX.Element {
  const [requiredDelay, setRequiredDelay] = useState<number>(0);
  const [delayApplied, setDelayApplied] = useState(false);

  const [blockReconnectionMs, setBlockReconnectionMs] = useState<number>(0);

  const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDelay = e.target.value ? parseInt(e.target.value, 10) : 0;
    if (!isNaN(newDelay) && newDelay >= 0 && newDelay !== requiredDelay) {
      setRequiredDelay(newDelay);
      setDelayApplied(false);
    }
  };

  const handleApplyDelay = () => {
    serverConnection.sendMatchRequest({ responseDelay: requiredDelay });
    setDelayApplied(true);
  };

  const handleBlockReconnectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? parseInt(e.target.value, 10) : 0;
    if (!isNaN(newValue) && newValue >= 0) {
      setBlockReconnectionMs(newValue);
    }
  };

  const handleCloseConnection = () => {
    serverConnection.sendMatchRequest({ closeConnection: true, blockReconnectionMs });
  };

  return (
    <OuterDiv>
      <Row>
        <Label htmlFor="blockReconnection">Block reconnections (ms):</Label>
        <NumberInput
          id="blockReconnection"
          type="number"
          min="0"
          value={blockReconnectionMs}
          onChange={handleBlockReconnectionChange}
        />
        <button onClick={handleCloseConnection}>Close Connection</button>
      </Row>

      <Row>
        <Label htmlFor="delay">Server delay (ms):</Label>
        <NumberInput
          id="delay"
          type="number"
          min="0"
          value={requiredDelay}
          onChange={handleDelayChange}
        />
        <button onClick={handleApplyDelay} disabled={delayApplied}>
          Apply
        </button>
      </Row>
    </OuterDiv>
  );
}
