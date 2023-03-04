import React, { useEffect } from "react";
import styled from "styled-components";
import { useTicker } from "../../../utils/use-countdown";
import { useGameContext } from "../client-side/game-context";

const Count = styled.div`
    font-family: helvetica;

    font-size: 50px;
    margin: 20px;
    margin: 20px;
    h1 {
        font-size: 50px;
        font-weight: bold;
    }

`;

function hoursMinSeconds(totalSecond: number) {
    
    function div60(num: number) {
        const nearestInt = Math.floor(num + 0.5);
   
        const rem = nearestInt % 60;
        const div = Math.floor((nearestInt - rem) / 60);

        return [rem, div];
    }

    function twoDigits(num: number) {
        return ((num < 10 ) ? "0" : "") + num;
    }

    const [secs, totalMinutes] = div60(totalSecond);
    const [mins, hours] = div60(totalMinutes);

    return `${hours}:${twoDigits(mins)}:${twoDigits(secs)}`; 
}

function Board() : JSX.Element {
    const {G: {count: serverCount}, moves } = useGameContext();
    const {count: localCount} = useTicker();

    const permittedServerLag = 10;
    useEffect(()=>{
        if(serverCount < localCount - permittedServerLag) {
            moves.setCount(localCount);
        }   
    },[serverCount, localCount]);

    return <Count>
        <h1>Reported time since start</h1>
        <p>{`Local: ${hoursMinSeconds(localCount)}`}</p>
        <p>{`Server: ${hoursMinSeconds(serverCount)}`}</p>
    </Count>; 
}

export default Board;

