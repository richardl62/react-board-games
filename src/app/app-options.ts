import { AppGame, Player } from './types'; //KLUDGE

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
  private default_: OptType | null;

  // Remove the search parameter with the given name and return it's value,
  // or the default if parameter not given
  get(searchParams: URLSearchParams): OptType | null {
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

const urlOptions = {
  playersPerBrowser: new Opt<number>('ppb', numberParser, 1),
  bgioDebugPanel: new Opt('debug-panel', booleanParser, false),
  matchID: new Opt('matchID', stringParser),
  player: new Opt('player', playerParser),
}

class AppOptions {
  readonly url: URL;
  readonly playersPerBrowser: number;
  readonly bgioDebugPanel: boolean;
  readonly matchID: string | null;
  readonly player: Player | null;

  constructor(url: URL) {
    this.url = url;

    let sp = new URLSearchParams(url.search);

    this.playersPerBrowser = urlOptions.playersPerBrowser.get(sp)!;
    this.bgioDebugPanel = urlOptions.bgioDebugPanel.get(sp)!;

    this.matchID = urlOptions.matchID.get(sp);
    this.player = urlOptions.player.get(sp);


    if(sp.toString()) {
      console.log("Unrecongised url parameters", sp.toString())
    }
  }

  // Golly, this is messy.
  getURL(game: AppGame, matchID_: string | null, player_: Player | null) {
    let url = new URL(game.name + '/online', this.url.origin);
    let sp = new URLSearchParams();

    let matchID = matchID_ || this.matchID;
    let player = player_ || this.player;

    urlOptions.playersPerBrowser.set(sp, this.playersPerBrowser);
    urlOptions.bgioDebugPanel.set(sp, this.bgioDebugPanel)
    urlOptions.matchID.set(sp, matchID);
    urlOptions.player.set(sp, player);

    url.search = sp.toString();
    return url;
  }
};

function useAppOptions () {
  return new AppOptions(new URL(window.location.href));

}
export {AppOptions, useAppOptions };