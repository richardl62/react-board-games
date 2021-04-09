import { useState } from 'react';

import { Player } from './types'; //KLUDGE

// KLUDGE: The code below in overly complex.
// This is (partly) because it started as an attempt at a general tool for
// getting and setting URL parameters.
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


const booleanParser: Parser<boolean> = {
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

// const playerParser: Parser<Player> = {
//   parse: (s: string): Player => {
//     const obj = JSON.parse(s);
//     if (obj instanceof Array && obj.length === 2) {
//       const [id, credentials] = obj;
//       return { id: id, credentials: credentials };
//     }

//     throw new Error("Bad player parameter");
//   },

//   stringify: (p: Player) =>
//     JSON.stringify([p.id, p.credentials])
// }

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
    if (searchParams.has(this.name)) {
      const val = searchParams.get(this.name);
      searchParams.delete(this.name);
      return this.parser.parse(val!);
    }

    return this.default_;
  }

  set(searchParams: URLSearchParams, value: OptType | null) {
    if (value && value !== this.default_) {
      const str = this.parser.stringify(value);
      searchParams.set(this.name, str);
    }
  }
};

const urlParsers = {
  playersPerBrowser: new Opt<number>('ppb', numberParser, 1),
  bgioDebugPanel: new Opt('debug-panel', booleanParser, false),
  matchID: new Opt('matchID', stringParser),
}

interface URLOptions {
  readonly playersPerBrowser: number;
  readonly bgioDebugPanel: boolean;
  readonly matchID: string | null;
};


function getURLOptions(): URLOptions {
  let sp = new URLSearchParams(window.location.search);

  const result = {
    playersPerBrowser: urlParsers.playersPerBrowser.get(sp)!,
    bgioDebugPanel: urlParsers.bgioDebugPanel.get(sp)!,
    matchID: urlParsers.matchID.get(sp),
  }

  if (sp.toString()) {
    console.log("Unrecongised url parameters", sp.toString())
  }

  return result;
}

const setURLOptions = (appOptions: AppOptions) => {
  const sp = new URLSearchParams();
  urlParsers.playersPerBrowser.set(sp, appOptions.playersPerBrowser);
  urlParsers.bgioDebugPanel.set(sp, appOptions.bgioDebugPanel)
  urlParsers.matchID.set(sp, appOptions.matchID);

  const url = new URL(window.location.href);
  url.search = sp.toString();

  window.location.href = url.href;
}

interface AppOptions extends URLOptions {
  readonly player: Player | null;
};



function useAppOptions(): [AppOptions, (arg: AppOptions) => void] {
  const [player, setPlayer ] = useState<Player|null>(null);

  const urlOptions = getURLOptions();
  const appOptions = {...urlOptions, player: player};

  const setAppOptions = (appOptions: AppOptions) => {
    setPlayer(appOptions.player);
    setURLOptions(appOptions);
  }
  return [appOptions, setAppOptions];
}

export { useAppOptions };
export type { AppOptions };