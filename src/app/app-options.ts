import { Player } from './types'; //KLUDGE

interface Parser<type> {
  parse: (param: string) => type;
  stringify: (param: type) => string;
}

const stringParser: Parser<string> = {
  parse: (s: string) => s,
  stringify: (s: string) => s,
}

const numberParser: Parser<number> = {
  parse: (s: string) => Number(s),
  stringify: (n: number) => n.toString(),
}


const booleanParser : Parser<boolean> = {
  parse: (s: string) => {
    if (s === '' || s === 'true') {
      return true;
    }

    if (s === 'false') {
      return false;
    }

    throw new Error("Bad boolean");
  },

  stringify: (b: boolean) => b ? 'true' : 'false',
}

const playerParser: Parser<Player> = {
  parse: (s: string): Player => {
    const obj = JSON.parse(s);
    if (obj instanceof Array && obj.length === 2) {
      const [id, credentials] = obj;
      return { id: id, credentials: credentials };
    }

    throw new Error("Bad player parameter");
  },

  stringify: (p: Player) => 
    JSON.stringify([p.id, p.credentials])
}

class Opt<OptType> {
  constructor(name: string, parser: Parser<OptType>, default_: OptType | null = null) {
      this.name = name;
      this.parser = parser;
      this.default_ = default_;
  }
  private name: string;
  private parser: Parser<OptType>;
  private default_?: OptType | null;

  // Remove the search parameter with the given name and return it's value,
  // or the default if parameter not given
  get(searchParams: URLSearchParams) {
    if(searchParams.has(this.name)) {
      const val = searchParams.get(this.name);
      searchParams.delete(this.name);
      return this.parser.parse(val!);
    }

    return this.default_; 
  }

  set(searchParams: URLSearchParams, value: OptType | null) {
    if(value && value !== this.default_) {
      const str = this.parser.stringify(value);
      searchParams.set(this.name, str);
    }
  }
};

export interface AppOptions {
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
  matchID: string | null;
  player: Player | null;
}

const options = {
  playersPerBrowser: new Opt('ppb', numberParser, 1),
  bgioDebugPanel: new Opt('debug-panel', booleanParser, false),
  matchID: new Opt('matchID', stringParser),
  player: new Opt('player', playerParser),
}



export function getOptions(searchParams_: URLSearchParams) : AppOptions {
  let searchParams = new URLSearchParams(searchParams_);
  let obj : any = {}; // KLUDGE - but what is the alternative?

  let key : keyof AppOptions; // Use of this key gives some type checking.
  for(key in options) {
    const val = options[key].get(searchParams);
    obj[key] = val;
  }

  return obj;
}

export function setOptions(searchParams: URLSearchParams, opts: AppOptions) {
  
  let key : keyof AppOptions; // Use of this key gives some type checking.
  for(key in options) {
    const val = opts[key];
    options[key].set(searchParams, val as any); // KLUDGE - but what is the alternative to 'any'?
  }
}

export function gamePath(game: string) {
  return `/${game}`;
}

export function matchPath(game: string, matchID: string, player?: Player) {
  let path = gamePath(game) + '?id=' + matchID;
  if(player) {
    path += ' ?player=' + JSON.stringify([player.id, player.credentials]);
  }
  return path;
}

// Exports are done inline