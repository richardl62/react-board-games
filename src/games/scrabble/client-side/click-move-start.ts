export type ClickMoveDirection = "right" | "down";

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
}
