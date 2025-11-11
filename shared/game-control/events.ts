// To do: Consider removing EventAPI and provide endTurn by a different means
export interface EventsAPI {
    endTurn: () => void;
}
