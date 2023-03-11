import React from "react";
import { debugOptionsInUse } from "../game-support/config";

export function Warnings() : JSX.Element {
    return <>
        {debugOptionsInUse() && <div>
            Warning: Debug options in use
        </div>}
    </>;
}