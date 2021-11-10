import { DragType, squareInteractionFunc, SquareInteractionFunc } from "game-support/deprecated/boards";
import { useErrorHandler } from "react-error-boundary";
import { Actions } from "../actions";
import { SquareID } from "../actions/actions";

export function useSquareInteraction(actions: Actions) : SquareInteractionFunc {
    const handleError = useErrorHandler();

    const moveFunctions = {

        onMoveEnd: (from: SquareID, to: SquareID | null) => {
            if (to) {
                try {
                    actions.dispatch({
                        type: "move",
                        data: { from: from, to: to },
                    });
                } catch (error) {
                    handleError(error);
                }
            }
        },

        dragType: (sq: SquareID) => actions.canMove(sq) ? DragType.move : DragType.disable,
    };

    return squareInteractionFunc(moveFunctions);
}