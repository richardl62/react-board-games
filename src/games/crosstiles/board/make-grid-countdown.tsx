import { JSX } from "react";
import styled from "styled-components";

const OuterDiv = styled.div`
    display: flex; 
    flex-direction: column;

    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
    
    font-family: "Times New Roman";
    font-size: 25px;
`;

const Seconds = styled.div`
    font-size: 40px;
`;

export interface MakeGridCountDownProps {
    secondsLeft: number;
}


export function MakeGridCountDown(props: MakeGridCountDownProps) : JSX.Element {
    const { secondsLeft } = props;
    return <OuterDiv>
        <div>Making grid in</div>
        <Seconds>{Math.floor(secondsLeft + 0.5)}</Seconds>
    </OuterDiv>;

}
