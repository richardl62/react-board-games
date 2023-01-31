import { useStandardBoardContext } from "../../../app-game-support/make-standard-board";
import { sAssert } from "../../../utils/assert";
import { BasicsGameProps } from "./basics-game-props";


export function useBasicsContext() : BasicsGameProps {
    const props = useStandardBoardContext();
    sAssert(props);

    return props as BasicsGameProps;
}

