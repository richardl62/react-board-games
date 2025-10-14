import { PieceHolderBackground } from "../../../utils/board/piece-holder";
import { SquareType } from "../config";

export const squareSize = "30px";

export const boardBoarderSize = {
    internal: "2px",
    external: "4px",
};

export const tileBackgroundColor = "brown";
export const boardBoarderColor = "rgb(100,0,0)";

export const tileTextColor = "white";
export const hightlightBorderColor = "yellow";
export const hoverBorderColor = "rgb(200 200 100)"; // Muddy green



export function squareBackground(type: SquareType) : PieceHolderBackground {
    let color;
    let text;
    switch(type) {
    case SquareType.tripleWord:
        color = "#e00000";  //darkish red
        text = "TW";
        break;
    case SquareType.doubleWord:
        color = "#ff7540";
        text = "DW";
        break;
    case SquareType.tripleLetter:
        color = "blue";
        text = "TL";
        break;
    case SquareType.doubleLetter:
        color = "lightblue";
        text = "DL";
        break;
    case SquareType.simple:
        color = "#fff8dc"; // cornsilk
        text = "";
        break;
    }

    return {color:color, text: text, textColor: "black"};
}
