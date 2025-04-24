import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";
import App from './app/app.tsx';


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

// eslint-disable-next-line react-refresh/only-export-components
function ErrorFallback({ error }: { error: Error }) {
    return (
        <ErrorFallbackStyled>
            <ErrorMessage>
                <span>Internal error:</span>
                <span>{error.message}</span>
            </ErrorMessage>

            {error.stack &&
        <div>
            <div>Gory details:</div>
            <ErrorStack>{error.stack}</ErrorStack> 
        </div>
            }
     
        </ErrorFallbackStyled>
    );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
