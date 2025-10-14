import { JSX, useEffect, useState } from "react";
import styled from "styled-components";
import { useTicker } from "../../../utils/use-countdown";
import { useGameContext } from "../client-side/game-context";

const OuterDiv = styled.div`
    margin: 20px;
    margin: 20px;

    p, h1 {
        font-family: helvetica;
        font-size: 40px;
    }

    label, input {
        font-size: 30px;
    }

    input {
        margin-left: 0.5em;
        width: 4em;
    }

`;

// function hoursMinSeconds(totalSecond: number) {
    
//     function div60(num: number) {
//         const nearestInt = Math.floor(num + 0.5);
   
//         const rem = nearestInt % 60;
//         const div = Math.floor((nearestInt - rem) / 60);

//         return [rem, div];
//     }

//     function twoDigits(num: number) {
//         return ((num < 10 ) ? "0" : "") + num;
//     }

//     const [secs, totalMinutes] = div60(totalSecond);
//     const [mins, hours] = div60(totalMinutes);

//     return `${hours}:${twoDigits(mins)}:${twoDigits(secs)}`; 
//}

function Ticks(props: {
    localCount?: number;
}) {
    const { localCount } = props;
    const {G: {count: serverCount} } = useGameContext();
    return <div>
        <p>Ticks since start</p>
        {localCount !== undefined && <p>{`Local: ${localCount}`}</p>}
        <p>{`Server: ${serverCount}`}</p>
    </div>;
}

function BoardCurrentPlayer() : JSX.Element {
    const { moves } = useGameContext();

    const {ellapsedTime} = useTicker();
    const [lastIncrement, setLastIncrement] = useState(0);
    const [localCount, setLocalCount] = useState(0);

    const [tickInterval, setTickInterval] = useState(10);

    useEffect(()=>{
        if(lastIncrement + tickInterval <= ellapsedTime) {
            moves.incrementCount();
  
            setLastIncrement(ellapsedTime);
            setLocalCount(localCount + 1);
        } 
    // Disabling the exhaustive-deps rule here is a kludge.
    // TO DO: Think more about this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ellapsedTime, tickInterval]);

    return <div>

        <Ticks localCount={localCount} />
        <label>
            Tick interval:
            <input
                type="number"
                value={tickInterval}
                min={0}
                step={1}
                onChange={(event) => {
                    const value = parseInt(event.target.value);
                    setTickInterval(value);
                }}
            />
        </label>


        <button
            onClick={() => moves.throwError("Testing")}
        > Throw error
        </button>
    </div>;
}


function Board() : JSX.Element {
    const {playerID, ctx: {currentPlayer} } = useGameContext();

    return <OuterDiv>
        {(playerID === currentPlayer) ? <BoardCurrentPlayer /> : <Ticks/>}

    </OuterDiv>;
}

export default Board;

