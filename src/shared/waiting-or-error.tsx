import React from "react";
import styled from "styled-components";

const Message = styled.div`
    font-size: large;
`;

const Waiting = styled.div`
    font-size: large;
`;

const ErrorMessage = styled(Waiting)`
    span:first-child {
        font-weight: bold;
        color: red;
        margin-right: 0.5em;
    }
`;

interface AsyncStatus {
    loading?: boolean; // 'loading' rather than 'waiting' to suit useAsync.
    error?: Error;
    result?: unknown;
}

function nDefined(elems: unknown[]) {
    return elems.filter(e => e !== undefined).length;
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

interface AsyncStatusProps {
    status: AsyncStatus;
    /** Optional name of activity. Used in error and waiting messages */ 
    activity: string;
}

export function AsyncStatus(props: AsyncStatusProps) : JSX.Element | null {
    const { status: {loading, error, result}, activity } = props;

    let message = "unexpected async status";
    if(nDefined([loading, error, result]) === 1) {
        if(loading) {
            message = "loading ...";
        }

        if(error) {
            message = "ERROR: " + error.message;
        }

        if(result !== undefined) {
            message = "result available";
        }
    }

    return <Message>
        <span>{activity + " : "}</span>
        <span>{message}</span>
    </Message>;

}
