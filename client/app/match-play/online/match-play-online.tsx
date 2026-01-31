import { JSX } from "react";
import { MatchPlayProps, StandardMatchPlay } from "./standard-match-play";
import { TestOptions } from "./test-options";

export function MatchPlayOnline(props: MatchPlayProps): JSX.Element {
    return <div>
        <TestOptions />
        <StandardMatchPlay {...props} />
    </div>;
}