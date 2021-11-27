import React, { useState } from "react";
import styled from "styled-components";

export type WaitingOrErrorStatus = "waiting" | Error | null;

const Waiting = styled.div`
    font-size: large;
`;

const ErrorMessage = styled.div`
    font-size: x-large;
    span:first-child {
        font-weight: bold;
        color: red;
    }
`;

interface WaitingOrErrorProps {
    status: WaitingOrErrorStatus;
    waitingMessage?: string;
    errorMessage?: string;
}

export function WaitingOrError(props: WaitingOrErrorProps) : JSX.Element | null {
    if(props.status === "waiting") {
        return <Waiting>{props.waitingMessage || "Waiting ..."} </Waiting>;
    }
    
    if(props.status instanceof Error) {
        const msg = props.errorMessage || "Error";
        return <ErrorMessage>
            <span>{`${msg}: `}</span>
            <span>{props.status.message}</span>
        </ErrorMessage>;
    }

    return null;
}

export function useWaitingOrError(): [WaitingOrErrorStatus, React.Dispatch<React.SetStateAction<WaitingOrErrorStatus>>] {
    return useState<WaitingOrErrorStatus>(null);
}

