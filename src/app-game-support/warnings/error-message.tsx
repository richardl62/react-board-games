import React from "react";
import styled from "styled-components";

const ErrorMessageDiv = styled.div`
    span:first-child {
    font-weight: bold;
    color: red;
    margin-right: 0.5em;
    }
`;

interface ServerErrorProps {
    category: string;
    message: string | null;
}

/** Render an error message.  Or render nothing if 'message' prop is null */
export function ErrorMessage(props: ServerErrorProps): JSX.Element | null {
    const { category, message } = props;

    if (!message) {
        return null;
    }
    // Capitalize the first letter of the catagory and add a colon.
    const categoryText = category.charAt(0).toUpperCase() + category.slice(1) + ":";

    return <ErrorMessageDiv>
        <span>{categoryText}</span>
        <span>{message}</span>
    </ErrorMessageDiv>;
}
