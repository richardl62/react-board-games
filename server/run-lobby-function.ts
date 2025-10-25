import { ParsedQs } from 'qs';


export function runLobbyFunction(/*matches: Matches,*/ query: ParsedQs) : unknown {
  
  const func = query.func;
  //console.log("Lobby function", func, "called with arg", query.arg);

  if(typeof func !== "string") {
    throw new Error("Function name missing or invalid in call to lobby");
  }

  let arg = null;
  if(typeof query.arg === "string") {
    arg = JSON.parse(query.arg);
  }

  if (typeof arg !== "object") {
    throw new Error("Parameter missing or invalid in call to lobby");
  }

  throw new Error(`Lobby function '${func}' not implemented.`);
}
