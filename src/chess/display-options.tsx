import { useState } from 'react';

class DisplayOptions {
    readonly reverseBoardRows: boolean;
    private setReverseBoardRows: (arg0: boolean) => void;
    
    constructor(reverseBoardRows: boolean, 
        setReverseBoardRows: (arg0: boolean) => void
        ) {
        this.reverseBoardRows = reverseBoardRows;
        this.setReverseBoardRows = setReverseBoardRows;
    }

    flipRowOrder() { this.setReverseBoardRows(!this.reverseBoardRows);}
}

function useDisplayOptions()
{
    return new DisplayOptions(...useState(false));
}

export { DisplayOptions, useDisplayOptions}