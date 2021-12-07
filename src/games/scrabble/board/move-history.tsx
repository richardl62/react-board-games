import React from "react";
import styled from "styled-components";
import { MoveHistoryElement } from "../actions/global-game-state";

const Name = styled.div`
    font-weight: bold;
    padding-right: 0.5em;
`;
const StyledMoveHistory = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    font-family: helvetica;
    font-size: 12px;
`;

const Word = styled.span`
    margin-left: 0.25em;
`;

const IllegalWord = styled(Word)`
    color: red;
    text-transform: uppercase;
`;

const Message = styled.div`
    font-family: helvetica;
    font-size: 14px;

    margin-top: 6px;
`;

interface MoveHistoryProps {
    moveHistory: MoveHistoryElement [];
}

export function MoveHistory(props: MoveHistoryProps): JSX.Element {

    const { moveHistory } = props;

    const hasIllegalWords = moveHistory.find(elem => elem.illegalWords && elem.illegalWords.length > 0);
    return <div>
        <StyledMoveHistory>
            {moveHistory.map((elem, index) =>
                [
                    <Name key={"n" + index}>{elem.name + ": "}</Name>,
                    <TurnDescription key={"t" + index} elem={elem} />
                ]
            )}
        </StyledMoveHistory>
        {hasIllegalWords && <Message>Illegal words are highlighted</Message>}
    </div>;
}

interface TurnDescriptionProps {
    elem: MoveHistoryElement;
}

function TurnDescription(props: TurnDescriptionProps) : JSX.Element {
    const { elem } = props;
    if(elem.pass) {
        return <div>Passed</div>;
    }

    if(elem.nTilesSwapped) {
        return <div>{`Swapped ${elem.nTilesSwapped} tiles`}</div>;
    }

    const {words, illegalWords, score} = elem;

    if(words && illegalWords && score) {
        const illegal = (word: string) => illegalWords.includes(word);
        return <div>
            <span>Played</span>
            {words.map((word, index) => {
                const Elem = illegal(word) ? IllegalWord : Word;
                return <Elem key={index}>{word}</Elem>;
            })}
            <Word>{`for ${score}`}</Word>
        </div>;
    }
        
    return <div>Problem with turn description</div>;

}
