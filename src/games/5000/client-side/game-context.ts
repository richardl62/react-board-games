import { useEffect, useState } from "react";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

interface GameContext extends TypedGameProps {
    diceSpin: number | null;
}

function useStep(from: number, to: number, step: number, delay: number) : [number | null, () => void]
{
    const [value, setValue] = useState(to);
    useEffect(() => {
        if (value < to) {
            const timer = setTimeout(() => setValue(value + step), delay);
            return () => clearTimeout(timer);
        }
    }, [value, to, delay]);
    
    return [
        value < to ? value : null,
        () => setValue(from),
    ];
}

export function useGameContext() : GameContext {
    const [diceSpin, start] = useStep(0, 360, 10, 100);
    if(diceSpin === null) {
        start();
    }

    const props = useStandardBoardContext() as TypedGameProps;
    return { ...props, diceSpin  };
}

