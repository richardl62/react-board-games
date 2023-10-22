import React, { useState } from "react";
import styled from "styled-components";
import { GoToStart, StepBackwards, StepForwards } from "./forward-back-arrows";

const OuterDiv = styled.div`
    display: flex;
    > *:not(:last-child) {
        margin-right: 5px;
    }
`;

export function HighScoringWordsControls() : JSX.Element {
    const [show, setShow] = useState(false);
    const [count, setCount] = useState(0);
    
    const toggleShow = () => {
        setCount(0);
        setShow(!show);
    };

    return <OuterDiv>
        <label>{"Show highest scroring word"}
            <input type="checkbox" checked={show} onChange={toggleShow} />
        </label>
        
        {show && <>
            <button onClick={() => setCount(0)} disabled={count === 0}>
                <GoToStart />
            </button>

            <button onClick={() => setCount(count - 1)} disabled={count === 0}>
                <StepBackwards />
            </button>

            <button onClick={() => setCount(count + 1)}>
                <StepForwards />
            </button>

            <div>{count}</div>
        </>}

    </OuterDiv>;
}