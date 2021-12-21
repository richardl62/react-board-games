import React from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { BoxWithLegend } from "../shared/box-with-legend";
import { AppGame } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { MatchLobbyWithApiInfo } from "./match-lobby";
import { StartMatch } from "./start-match";
const GameLobbyDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
`;
interface GameLobbyProps {
    game: AppGame;
}

export function GameLobby(props: GameLobbyProps): JSX.Element {
    const { game } = props;
    const asyncMatchList = useAsync(() => makeLobbyClient().listMatches(game.name), []);

    const matches = asyncMatchList.result?.matches;

    return <GameLobbyDiv>
        <WaitingOrError status={asyncMatchList} activity="getting list of matches" />
        {matches && matches.map(match =>
            <BoxWithLegend key={match.matchID} legend="Existing Game">
                <MatchLobbyWithApiInfo game={game} match={match} />
            </BoxWithLegend>
        )}

        <StartMatch game={game} />
    </GameLobbyDiv>;
     
}