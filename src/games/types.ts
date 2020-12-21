import {GameProps as SimpleGameProps} from '../simple-board-game';

interface GameProps extends SimpleGameProps {
    displayName: string;
}  

export type {GameProps};