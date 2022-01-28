import React from "react";
import styled from "styled-components";
import { DndProvider } from "../../../game-support/drag-drop";
import { useScrabbleContext } from "./scrabble-context";
import { MainBoard } from "./main-board";
import { RackAndControls } from "./rack-and-controls";
import { ScoresEtc } from "./scores-etc";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";
import { Options } from "./options";


const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
`;

const Centered = styled.div`
  display: flex;
  align-self: center;
`;

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

const ErrorMessage = styled.div`
    span:first-child {
    font-weight: bold;
    color: red;
    margin-right: 0.5em;
    }
`;


function ServerError(): JSX.Element | null {
    const serverError = useScrabbleContext().bgioProps.G.serverError;
    
    if(!serverError) {
        return null;
    }

    return <ErrorMessage> 
        <span>Server Error:</span> 
        <span>{serverError}</span>
    </ErrorMessage>;
}

function BagInfo(): JSX.Element {
    const context = useScrabbleContext();

    return <div>
        Tiles in bag: <span>{context.nTilesInBag}</span>
    </div>;
}

export function MainGameArea(): JSX.Element {
    return <DndProvider>
        <Game>
            <ServerError />
            <Options />
            <ScoresEtc/>
            <RackAndControls/>
            <Centered>
                <MainBoard/>
            </Centered>
            <SpaceBetween>
                <WordChecker />
                <BagInfo/>
            </SpaceBetween>

            <TurnControl/>
        </Game>
    </DndProvider>;
}
