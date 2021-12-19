import React from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { AppGame } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { MatchLobbyWithApiInfo } from "./match-lobby";
import { StartMatch } from "./start-match";

const GameLobbyDiv = styled.div`
    display: inline-flex;
    flex-direction: column;

    > div {
        border: 1px black dashed;
        width: auto;
        margin-bottom: 9px;
        padding: 5px;
        border-radius: 5px;
    }
`;

interface GameLobbyProps {
    game: AppGame;
}

export function GameLobby(props: GameLobbyProps): JSX.Element {
    const { game } = props;
    const asyncMatchList = useAsync(() => makeLobbyClient().listMatches(game.name), []);

    const matches = asyncMatchList.result?.matches;

    return <div>
        <div>
            <GameLobbyDiv>
                <WaitingOrError status={asyncMatchList} activity="getting list of matches" />
                {matches && matches.map(match =>
                    <MatchLobbyWithApiInfo key={match.matchID} game={game} match={match} />
                )}
            </GameLobbyDiv>
        </div>
        <StartMatch game={game} />
    </div>;
     
}