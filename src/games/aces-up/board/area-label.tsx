import styled from "styled-components";
import { rowGap } from "../game-support/styles";

export const AreaLabelBelow = styled.div`
    text-align: center;

    border: solid 2px currentcolor;
    border-top: none;

    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;

    margin-bottom: ${rowGap.belowLabels};
`;
