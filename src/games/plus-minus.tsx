import { Ctx } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { AppGame, GameCategory, GameWarnings, WaitingForPlayers } from "../app-game-support";
import { WrappedGameProps, DefaultMovesType } from "../app-game-support/wrapped-game-props";

// Needlessly complex to help with testing. (Hmm, that seems to be contradict itself.)
interface G {
  data: {
    dummy: string;
    count: number;
  }
  dummy: string;
}

const Name = styled.span<{ toPlay: boolean }>`
  text-decoration: ${props => props.toPlay ? "underline" : "none"}
`;
function PlayerData(props: WrappedGameProps<G>) {
    const playerSpan = (id: string) => {
        const { status, name } = props.playerData[id];
        const isActive = id === props.playerID;
        const toPlay = id === props.ctx.currentPlayer;

        return (
            <span key={name}>
                <Name toPlay={toPlay}>
                    {name + (isActive ? " (you)" : "")}
                </Name>
                <span>
                    {(status !== "connected") && ` (${status})`}
                    {" - "}
                </span>
            </span>
        );
    };

    return <div>
        {props.ctx.playOrder.map(playerSpan)}
    </div>;
}

function Board(props: WrappedGameProps<G,DefaultMovesType/*KLUDGE*/>): JSX.Element {

    if (!props.allJoined) {
        return <WaitingForPlayers {...props} />;
    }

    const { G, moves, events } = props;
    return (
        <div>
            <PlayerData {...props} />
            <GameWarnings {...props} />
            {props.allJoined && (<div>
                <button type="button" onClick={(() => moves.add(1))}>+1</button>
                <button type="button" onClick={(() => moves.add(-1))}>-1</button>
                <button type="button" onClick={() => events.endTurn()}>End Turn</button>
                <div>{G.data.count}</div>
            </div>)}
        </div>
    );
}

const game: AppGame = {
    name: "plusminus",
    displayName: "Plus Minus",
    category: GameCategory.test,

    setup: (): G => {
        return {
            data: {
                dummy: "dummy string",
                count: 0,
            },
            dummy: "another dummy string",
        };
    },

    minPlayers: 1,
    maxPlayers: 100,

    moves: {
        add: (G: G, ctx: Ctx, value: number): void => {
            G.data.count += value;
        },
    },

    board: (props: WrappedGameProps) => {
        const castProps = props as WrappedGameProps<G,DefaultMovesType/*KLUDGE*/>;
        return <Board {...castProps}/>;
    },
};

export default [game];

