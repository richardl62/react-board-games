import { RandomAPI, seededDraw } from "@shared/game-control/random-api";
import { useState, useMemo } from "react";

export function useRandomAPI(): RandomAPI {
    const [seed] = useState(Math.random());
    return useMemo(() => {
        return new RandomAPI(seededDraw(seed));
    }, [seed]);
}