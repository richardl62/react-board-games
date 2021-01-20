import { FC } from 'react';

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

    // KLUDGE? Define the style here rather than in a css file as
    // css files caused problems with the heroku server. (No doubt
    // the problems could be fixed, but ...)
    const style = {
        backgroundColor: color,

        height: "80%",
        width: "80%",
        margin: "10%",
        borderRadius: "50%",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        fontSize: "150%",
    }

    return (
        <div className="piece__counter" style={style}>
            {text ? innerText() : null}
        </div>
    );
}

export { Counter };
