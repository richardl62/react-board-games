import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";


type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

interface GameContext extends TypedGameProps {
    diceSpin: number;
}

export function useGameContext() : GameContext {
    const diceSpin = 0;
    const props = useStandardBoardContext() as TypedGameProps;
    return { ...props, diceSpin };
}

