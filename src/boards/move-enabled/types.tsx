import { BoardStyle, MoveFunctions } from "../interfaces";
import { Element } from "./board";



export interface BoardProps extends BoardStyle, MoveFunctions {
    elements: Array<Array<Element>>;
    id?: string;
}
 