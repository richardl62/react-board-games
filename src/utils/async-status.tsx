import React from "react";
import styled from "styled-components";

const Message = styled.div`
    font-size: large;
`;

interface AsyncStatus {
    loading?: boolean; // 'loading' rather than 'waiting' to suit useAsync.
    error?: Error;
    result?: unknown;
}

interface AsyncStatusProps {
    status: AsyncStatus;
    /** Optional name of activity. Used in error and waiting messages */ 
    activity: string;
}

export function AsyncStatus(props: AsyncStatusProps) : JSX.Element {
    const { status,  activity } = props;
    const {loading, error, result} = status;


    let nSet = 0;
    let message = "";

    if (loading) {
        ++nSet;
        message = "loading ...";
    }

    if (error) {
        ++nSet;
        message = "ERROR: " + error.message;
    }

    if (result !== undefined) {
        ++nSet;
        message = "result available";
    }
    
    if(nSet === 0) {
        // The status appears to be the result of an useAsyncCallback which has 
        // not yet been triggerd
        message = "operation not started";
    }

    return <Message>
        <span>{activity + " : "}</span>
        <span>{message}</span>
    </Message>;
}

// Convenience function
export function loadingOrError(props: AsyncStatus) : boolean {
    const { loading, error } = props;

    return Boolean(loading || error);

}

// Convenience function
export function LoadingOrError(props: AsyncStatusProps) : JSX.Element | null {

    if(loadingOrError(props.status)) {
        return <AsyncStatus {...props} />;
    }

    return null;
}