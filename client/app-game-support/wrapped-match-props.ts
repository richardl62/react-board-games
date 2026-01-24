import { BoardProps, UntypedMoves } from "@/app-game-support/board-props";
import { useEffect } from "react";
import { makePlayerDataHACKED, PlayerDataDictionary } from "./player-data";

export interface WrappedMatchProps<
    G=unknown, 
    Moves extends UntypedMoves=UntypedMoves
> extends BoardProps<G, Moves> {
    playerData: PlayerDataDictionary;

    allJoined: boolean;
    
    getPlayerName: (pid: string) => string;
}

export function useWrappedMatchProps<G>(bgioProps: BoardProps<G>): WrappedMatchProps<G> {
    useEffect(() => {
        console.log("Using makePlayerDataHACKED - temporary hack");
    }, []);
    const playerData = makePlayerDataHACKED(bgioProps.ctx, bgioProps.matchData);


    const allJoined = Object.values(playerData).every(pd => pd.status !== "not joined");
    
    return {
        ...bgioProps,
        playerData,
        allJoined,

        getPlayerName: (pid: string) => {
            const pd = playerData[pid];
            if(!pd) {
                console.error("Invalid player id:", pid);
                return "<unknown>";
            }
            return playerData[pid].name;
        }
    };
}
