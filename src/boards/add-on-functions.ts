
import { map2DArray } from "../shared/tools";
import { BoardProps } from "./board";
import { OnFunctions } from "./square";

export function addOnFunctions(props: BoardProps, onFunctions: OnFunctions) {  


    props.elements = map2DArray(props.elements, 
         elem => {return {...elem, ...onFunctions}}   
        )

    return props;
}
