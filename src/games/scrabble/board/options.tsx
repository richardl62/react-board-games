import React, { useState } from "react";
import styled from "styled-components";

const OptionsDiv = styled.div`
    display: flex;
    justify-content: right;
    font-size: 14px;
    label {
        margin-left: 2px;
    }    
`;

export function Options() : JSX.Element {
    const  [ checked, setChecked ] = useState(false);
    return <OptionsDiv>
        <input type="checkbox" id="sounds" onClick={()=>setChecked(!checked)} checked={checked} />
        <label htmlFor="sounds">sounds</label>
    </OptionsDiv>;
}