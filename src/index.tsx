import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";
import App from "./app";

const ErrorFallbackStyled=styled.div`
  font-size: large;
  * {
    margin-bottom: 0.5em;
  }
`;

const ErrorMessage=styled.div`

  span:first-child {
    font-weight: bold;
    color: red;
    margin-right: 0.5em;
  }
`;

const ErrorStack=styled.div`
  font-size: small;
  margin-left: 1em;
`;

function ErrorFallback({ error }: { error: Error }) {
    return (
        <ErrorFallbackStyled>
            <ErrorMessage>
                <span>Internal error:</span>
                <span>{error.message}</span>
            </ErrorMessage>

            <div>
                <span>{"If you are lucky, refreshing will help "}</span>
                <button onClick={()=>window.location.reload()}>Refresh</button>
            </div>

            {error.stack &&
        <div>
            <div>Gory details:</div>
            <ErrorStack>{error.stack}</ErrorStack> 
        </div>
            }
     
        </ErrorFallbackStyled>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
        >
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
);