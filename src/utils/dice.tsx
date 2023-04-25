import React from "react";
// Represent one die
export function Die(props: { face: number }) {
    return (
        <div className="die">
            <div className="die-face">{props.face}</div>
        </div>
    );
}

// A set of dice
export function Dice(props: { faces: number[] }) {
    return (
        <div className="die-set">
            {props.faces.map((face, i) => (
                <Die face={face} key={i} />
            ))}
        </div>
    );
}
