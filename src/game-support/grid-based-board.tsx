import React from 'react';

interface BoardGridProps {
    squares: Array<Array<JSX.Element>>;
    //To do: Add display properties (e.g. 'checkered');
}

export function BoardGrid({ squares }: BoardGridProps) {

    return <div> {squares} </div>;
}
