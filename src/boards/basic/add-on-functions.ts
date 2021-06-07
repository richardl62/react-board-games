
import { BoardProps } from "./board";
import { ClickDrag } from "./click-drag";

export function addOnFunctions(props: BoardProps, clickDrag: ClickDrag) {  
    const { elements } = props;

    const onFunctions = clickDrag.basicOnFunctions();

    for(let row = 0; row < elements.length; ++row) {
        for(let col = 0; col < elements[row].length; ++col) {
            elements[row][col] = {...elements[row][col], ...onFunctions};
        }
    }

    if(clickDrag.start) {
        const {row, col} = clickDrag.start;
        elements[row][col].backgroundColor = 'black';
    }

    return props;
}
