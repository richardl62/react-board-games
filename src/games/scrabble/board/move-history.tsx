import React from "react";
import styled from "styled-components";
import { MoveHistoryElement, WordsPlayedInfo } from "../server-side/move-hstory";
import { useScrabbleContext } from "../client-side/scrabble-context";

const FirstSpan = styled.span`
    font-weight: bold;
    padding-right: 0.5em;
`;

const StyledMoveHistory = styled.div`
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

interface WordPlayedProps {
    wordPlayed: WordsPlayedInfo;
}

function WordPlayed(props: WordPlayedProps) {
    const {pid, words, illegalWords, score} = props.wordPlayed;
    const { getPlayerName: name } = useScrabbleContext().wrappedGameProps; 

    const illegal = (word: string) => illegalWords.includes(word);
    return <div>
        <FirstSpan>{name(pid)}</FirstSpan>
        <span>Played</span>
        {words.map((word, index) => {
            const Elem = illegal(word) ? IllegalWord : Word;
            return <Elem key={index}>{word}</Elem>;
        })}
        <Word>{`for ${score}`}</Word>
    </div>;
}

interface ScoreAdjustmentsProps {
    adjustments: {[id: string]: number};
}

function ScoreAdjustments(props: ScoreAdjustmentsProps) {
    const { adjustments } = props;
    const { getPlayerName: name } = useScrabbleContext().wrappedGameProps;

    // preprocessed is use to help with adding commas.
    const preprocessed = [];
    for(const id in adjustments) {
        if(adjustments[id] !== 0) {
            preprocessed.push({id: id, adjustment: adjustments[id]});
        }
    }
    
    const elems = [];
    for(let index = 0; index < preprocessed.length; ++index) {
        const {id, adjustment} = preprocessed[index];
 
        const sign = adjustment > 0 ? "+" : "";
        let text = `${name(id)}: ${sign}${adjustment}`;
        if(index < preprocessed.length - 1) {
            text += ", ";
        }
        elems.push(<span key={id}>{text}</span>);
    }

    return <div>
        <FirstSpan>Scores adjusted</FirstSpan>
        {elems}
    </div>;
}

interface WinnersProps {
    winners: string[];
}

function GameOver(props: WinnersProps) {
    const { winners } = props;
    const { getPlayerName: name } = useScrabbleContext().wrappedGameProps;
    if(winners.length === 1) {

        return <div>
            <FirstSpan>Winner</FirstSpan>
            <span>{name(winners[0])}</span>
        </div>;
    } else {
        return <FirstSpan>DRAW</FirstSpan>;
    }
}

interface MoveErrorProps {
    message: string;
}

function MoveError({message}: MoveErrorProps) {
    return <div>
        <FirstSpan>Error during move</FirstSpan>
        <span>{message}</span>
    </div>;
}

interface TurnDescriptionProps {
    elem: MoveHistoryElement;
}

function TurnDescription(props: TurnDescriptionProps) : JSX.Element {
    const { elem } = props;
    const { getPlayerName: name } = useScrabbleContext().wrappedGameProps;

    if(elem.wordsPlayed) {
        return <WordPlayed wordPlayed={elem.wordsPlayed} />;
    }

    if(elem.tilesSwapped ) {
        const { pid, nSwapped} = elem.tilesSwapped;
        return <div>
            <FirstSpan>{name(pid)}</FirstSpan>
            <span>{`swapped ${nSwapped} tiles`}</span>
        </div>;
    }

    if(elem.pass) {
        return <div>
            <FirstSpan>{name(elem.pass.pid)}</FirstSpan>
            <span>passed</span>
        </div>;
    }

    if(elem.scoresAdjusted) {
        return <ScoreAdjustments adjustments={elem.scoresAdjusted} />;
    }
        
    if(elem.gameOver) {
        return <GameOver winners={elem.gameOver.winners} />;
    }

    if(elem.moveError) {
        return <MoveError message={elem.moveError.message} />;
    }

    return <div>Problem with turn description</div>;
}

interface MoveHistoryProps {
    moveHistory: MoveHistoryElement [];
}

export function MoveHistory(props: MoveHistoryProps): JSX.Element {

    const { moveHistory } = props;

    const hasIllegalWords = moveHistory.find(elem => elem.wordsPlayed && elem.wordsPlayed.illegalWords.length > 0);
    return <div>
        <StyledMoveHistory>
            {moveHistory.map((elem, index) =>
                [
                    <TurnDescription key={"t" + index} elem={elem} />
                ]
            )}
        </StyledMoveHistory>
        {hasIllegalWords && <Message>Illegal words are highlighted</Message>}
    </div>;
}
