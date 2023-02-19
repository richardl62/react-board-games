import React from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { AppGame } from "../app-game-support";
import { standardOuterMargin } from "../app-game-support/styles";
import { LoadingOrError } from "../utils/async-status";
import { makeLobbyClient } from "./lobby-tools";
import { MatchLobbyWithApiInfo } from "./match-lobby";
import { StartMatch } from "./start-match";

const GameLobbyDiv = styled.div`
    display: inline-flex;
    flex-direction: column;

    margin: ${standardOuterMargin};
`;
interface GameLobbyProps {
    game: AppGame;
}

export function GameLobby(props: GameLobbyProps): JSX.Element {
    const { game } = props;
    const asyncMatchList = useAsync(() => makeLobbyClient().listMatches(game.name), []);

    const matches = asyncMatchList.result?.matches;

    return <GameLobbyDiv>
        <LoadingOrError status={asyncMatchList} activity="getting list of matches" />
        {matches && matches.map(match =>
            <MatchLobbyWithApiInfo key={match.matchID} game={game} match={match} />
        )}

        <StartMatch game={game} />
    </GameLobbyDiv>;
     
}