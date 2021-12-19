import React from "react";
import styled from "styled-components";

const Waiting = styled.div`
    font-size: large;
`;

const ErrorMessage = styled.div`
    font-size: x-large;
    span:first-child {
        font-weight: bold;
        color: red;
        margin-right: 0.5em;
    }
`;

interface AsyncStatus {
    loading?: boolean; // 'loading' rather than 'waiting' to suit useAsync.
    error?: Error;
}

export function waitingOrError(status: AsyncStatus) : boolean {
    return Boolean(status.loading || status.error );
}

interface WaitingOrErrorProps {
    status: AsyncStatus;
    /** Optional name of activity. Used in error and waiting messages */ 
    activity?: string;
}

export function WaitingOrError(props: WaitingOrErrorProps) : JSX.Element | null {
    const { status: {loading, error}, activity } = props;

    if(loading) {
        const text = (activity || "waiting") + "...";
        return <Waiting>{text}</Waiting>;
    }
    
    if(error) {
        let initialText = "Error";
        if(activity) {
            initialText += " " + activity;
        }
        initialText+=":";

        return <ErrorMessage>
            <span>{initialText}</span>
            <span>{error.message}</span>
        </ErrorMessage>;
    }

    return null;
}
