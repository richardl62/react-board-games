import { Letter } from "../config";
import { ScoreCategory } from "../server-side/score-categories";

type CheckerFunction = (grid: (Letter|null) [][]) => number | false;

export const gridCheck: { [category in ScoreCategory] : CheckerFunction} = {
    length3: () => false,
    length4: () => 40,
    length5: () => 50,
};   