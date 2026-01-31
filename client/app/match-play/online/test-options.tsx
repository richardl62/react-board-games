import { ChangeEvent, JSX, useState } from "react";
import styled from "styled-components";

// Good enough styling for test options.
const OuterDiv = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
`;

const CloseConnection = styled.button`
    margin-right: 0.5rem;
`;

const NumberInput = styled.input`;
    width: 6rem;
`;


// Test options of online play. 
export function TestOptions(): JSX.Element {
    const [value, setValue] = useState<number>(0)

    const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
        if ( !e.target.value ) {
            setValue(0);
            return;
        }
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) {
            setValue(val);
        }
    };

    const handleCloseConnection = () => {
        console.log("close connection clicked");
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
                value={value}
                onChange={handleDelayChange}
            />

        </OuterDiv>
    );
}
