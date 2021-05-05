import React from 'react';

export namespace Boards {

    interface GridProps {
        squares: Array<Array<JSX.Element>>;
        //To do: Add display properties (e.g. 'checkered');
    }

    export function Grid ( { squares }: GridProps) {
        return <div> {squares} </div>;
    }
}