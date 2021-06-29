import { Bgio } from "../../shared/types";
import { GameData } from "./game-actions";

export function GameInteractions(props: Bgio.BoardProps<GameData>) {
  return <button onClick={() => props.moves.fillRack()}>Draw</button>;
}
