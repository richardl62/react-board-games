import { useSearchParamData } from "@/url-tools";
import { RandomAPI, seededDraw } from "@shared/utils/random-api";
import { useState, useMemo } from "react";

export function useRandomAPI(): RandomAPI {
    const {seed: seedParam} = useSearchParamData();
    const [seed] = useState(seedParam? 1.0 / (seedParam+1) : Math.random());
    return useMemo(() => {
        return new RandomAPI(seededDraw(seed));
    }, [seed]);
}