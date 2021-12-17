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

interface WaitingOrErrorProps {
    status: AsyncStatus;
}

export function waitingOrError(status: AsyncStatus) : boolean {
    return Boolean(status.loading || status.error );
}

export function WaitingOrError(props: WaitingOrErrorProps) : JSX.Element | null {
    const { loading, error } = props.status;

    if(loading) {
        return <Waiting>Waiting...</Waiting>;
    }
    
    if(error) {
        return <ErrorMessage>
            <span>Error:</span>
            <span>{error.message}</span>
        </ErrorMessage>;
    }

    return null;
}
