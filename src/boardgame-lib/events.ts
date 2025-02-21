export interface EventsAPI {
    endTurn?: () => void;
    endGame?: (arg0: string) => void;
}