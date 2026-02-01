import { ChangeEvent, JSX, useState } from "react";
import styled from "styled-components";
import { ServerConnection } from "./use-server-connection";

// Good enough styling for test options.
const OuterDiv = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
`;

const CloseConnection = styled.button`
    margin-right: 0.5rem;
`;

const NumberInput = styled.input`
    width: 6rem;
    margin-right: 0.3rem;
`;


// Extra options for use in debug mode.
export function DebugModeActions({ serverConnection }: { serverConnection: ServerConnection }): JSX.Element {
    const [ requiredDelay, setRequiredDelay ] = useState<number>(0);
    const [ delayApplied, setDelayApplied ] = useState(false);    

    const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDelay = e.target.value ? parseInt(e.target.value, 10) : 0;
        if (!isNaN(newDelay) && newDelay >= 0 && newDelay !== requiredDelay ) {
            setRequiredDelay(newDelay);
            setDelayApplied(false);
        }
    };

    const handleApplyDelay = () => {
        serverConnection.sendMatchRequest({ responseDelay: requiredDelay });
        setDelayApplied(true);
    }

    const handleCloseConnection = () => {
        serverConnection.sendMatchRequest({ closeConnection: true });
    };

    return (
        <OuterDiv>
            <CloseConnection onClick={handleCloseConnection}>
                Close Connection
            </CloseConnection>

            <label htmlFor="delay">Server delay (ms):</label>
            <NumberInput
                id="delay"
                type="number"
                min="0"
                value={requiredDelay}
                onChange={handleDelayChange}
            />
            <button 
                onClick={handleApplyDelay}
                disabled={delayApplied}
            >
                Apply
            </button>

        </OuterDiv>
    );
}
