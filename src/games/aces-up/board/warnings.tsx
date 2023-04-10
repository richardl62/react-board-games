import React from "react";
import { debugOptionsInUse } from "../game-support/options";

export function Warnings() : JSX.Element {
    return <>
        {debugOptionsInUse() && <div>
            Warning: Debug options in use
        </div>}
    </>;
}