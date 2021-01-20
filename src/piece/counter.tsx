import { FC } from 'react';
import styles from './piece.module.css';
import { nonNull } from './../tools';

interface Props {
    color: string;
    text?: string | null;
    textColor?: string | null;
}

const Counter: FC<Props> = ({ color, text, textColor }: Props) => {

    const innerText = () => {
        const style = { color: textColor ? textColor : undefined };

        return <div style={style}>{text}</div>
    }

    const style = { backgroundColor: color };
    return (
        <div className={nonNull(styles.counter)} style={style}>
            {text ? innerText() : null}
        </div>
    );
}

export { Counter };
