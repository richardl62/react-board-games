import { WebSocket } from 'ws';
import { GameControl } from '../shared/game-control/game-control.js';
import { matchMove } from '../shared/game-control/match-action.js';
import * as LobbyTypes from '../shared/lobby/types.js';
import { ActiveMatchState, MatchState } from '../shared/match-state.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import { WsMove } from '../shared/ws-requested-action.js';
import { Player } from './player.js';
import { endMatch, endTurn } from '../shared/game-control/ctx.js';
import { makeActiveMatchState } from '../shared/game-control/make-active-match-data.js';
import { WsResponseTrigger } from '../shared/ws-response-trigger.js';
import { WsServerResponse } from '../shared/ws-server-response.js';
import { sendServerResponse } from './web-socket-actions.js';
import { saveMatch } from './match-archive.js';
import { saveLiveMatch, SavedMatch } from './live-matches.js';
import { isSupabaseEnabled } from './supabase.js';
import { WsRematchRequest } from '../shared/ws-rematch-request.js';
import { MatchOptions } from '../shared/match-options.js';

// A match is an instance of a game.
export class Match {
  readonly definition: GameControl;
  readonly matchID: string;

  readonly players: Player[];
  readonly random: RandomAPI;

  // Kept so that the match can be restarted.
  private readonly setupData: unknown;

  // Not used by the server, but passed on to the clients.
  private readonly matchOptions: MatchOptions;

  // Data that can be changed by a move or event.
  private activeData: ActiveMatchState;

  // The random seed supplied by the proposer of a rematch. Null if there is no
  // rematch proposal.
  private rematchSeed: number | null = null;

  private responseDelay = 0;

  // The number of the current game within this match: 1 initially, and increased
  // each time the match is restarted (i.e. on a rematch).
  private gameNumber = 1;

  // Saves (to the archive and of the live match) are chained so that they complete
  // in the order they were requested. Otherwise, an older state could overwrite a
  // newer one.
  private saveQueue: Promise<void> = Promise.resolve();

  constructor(
    gameControl: GameControl,
    {
      matchID,
      numPlayers,
      setupData,
      matchOptions,
      randomAPI,
    }: {
      matchID: string;
      numPlayers: number;
      setupData: unknown;
      matchOptions: MatchOptions;
      randomAPI: RandomAPI;
    },
  ) {
    this.definition = gameControl;
    this.matchID = matchID;
    this.random = randomAPI;
    this.setupData = setupData;
    this.matchOptions = matchOptions;

    const { playerData: setupPlayerData, ...activeMatchState } = makeActiveMatchState(
      gameControl,
      numPlayers,
      setupData,
      randomAPI,
    );
    this.activeData = activeMatchState;

    this.players = [];
    for (let id = 0; id < numPlayers; ++id) {
      const playerId = this.activeData.ctxData.playOrder[id];
      const player = new Player(playerId);
      if (setupPlayerData) {
        player.setGameData(setupPlayerData[playerId]);
      }
      this.players[id] = player;
    }
  }

  get gameName() {
    return this.definition.name;
  }

  allocatePlayer(name: string): Player {
    const player = this.players.find((p) => !p.isAllocated);
    if (!player) {
      throw new Error('No unallocated player found');
    }

    if (this.findPlayer({ name })) {
      throw new Error(`player name "${name}" already in use`);
    }

    player.allocate(name);

    return player;
  }

  // Restart the match from scratch, using the original setup data. Players (including
  // their IDs, names, credentials and connections) are unchanged, but the match will
  // be archived under a new ID.
  restart(randomSeed: number) {
    const { playerData: setupPlayerData, ...activeMatchState } = makeActiveMatchState(
      this.definition,
      this.players.length,
      this.setupData,
      RandomAPI.fromSeed(randomSeed),
    );
    this.activeData = activeMatchState;

    for (const player of this.players) {
      player.setGameData(setupPlayerData?.[player.id]);
    }
    this.clearRematchProposal();

    ++this.gameNumber;
  }

  // The key of the current game in the match archive. Each game in a match (i.e.
  // the original game and any rematches) is archived separately.
  private get archiveID(): string {
    return `${this.matchID}-${this.gameNumber}`;
  }

  // Process a rematch request (see WsRematchRequest), restarting the match if all
  // players now want a rematch. Returns true if the match was restarted.
  // Throws if the request is invalid, in which case no data is changed.
  handleRematchRequest(player: Player, request: WsRematchRequest): boolean {
    switch (request.rematch) {
      case 'propose':
        if (!this.players.every((p) => p.isAllocated)) {
          throw new Error('Cannot propose a rematch until all players have joined');
        }
        // If a rematch has already been proposed, treat this as an acceptance.
        this.rematchSeed ??= request.randomSeed;
        player.setWantsRematch(true);
        break;

      case 'accept':
        // Ignore an acceptance if the proposal has since been declined.
        if (this.rematchSeed !== null) {
          player.setWantsRematch(true);
        }
        break;

      case 'decline':
        this.clearRematchProposal();
        break;
    }

    if (this.rematchSeed !== null && this.players.every((p) => p.wantsRematch)) {
      this.restart(this.rematchSeed);
      return true;
    }

    return false;
  }

  private clearRematchProposal() {
    this.rematchSeed = null;
    for (const player of this.players) {
      player.setWantsRematch(false);
    }
  }

  lobbyMatch(): LobbyTypes.Match {
    return {
      gameName: this.definition.name,
      matchID: this.matchID,
      players: this.players.map((p) => p.publicMetadata()),
    };
  }

  matchState(errorInLastAction: string | null): MatchState {
    return {
      ...this.activeData,
      playerData: this.players.map((p) => p.publicMetadata()),
      errorInLastAction,
    };
  }

  // Can throw, in which case no data is changed.
  move(request: WsMove, playerID: string) {
    const { move, arg } = request;
    const { playerData: updatedPlayerData, ...activeState } = matchMove(
      this.definition,
      move,
      playerID,
      this.matchState(null),
      arg,
    );
    this.activeData = activeState;

    for (const p of updatedPlayerData) {
      const player = this.findPlayer({ id: p.id });
      if (player) {
        player.setGameData(p.gameData);
      }
    }
  }

  // Can throw, in which case no data is changed.
  endTurn() {
    endTurn(this.activeData.ctxData);
  }

  // Can throw, in which case no data is changed.
  endMatch() {
    endMatch(this.activeData.ctxData);
  }

  // Save the current match state to the online archive, if archiving is enabled
  // for this game. The save happens asynchronously. Failures are logged rather than
  // thrown, so that problems with the archive do not affect live matches.
  archive() {
    const { archive, stateVersion } = this.definition;
    if (!archive || !isSupabaseEnabled) {
      return;
    }

    // Snapshot now, as the match state can be changed in place before the save runs.
    const record = structuredClone({
      id: this.archiveID,
      game: this.gameName,
      players: this.players.map((p) => p.name),
      archiveVersion: stateVersion,
      matchState: this.matchState(null),
    });
    const updatedAt = new Date();

    this.queueSave('archive', () => saveMatch(record, updatedAt));
  }

  // Save everything needed to restore the match after a server restart. Should be
  // called after any change to the match (including players joining or being
  // renamed). As for archive(), the save is asynchronous and failures are logged.
  saveLive() {
    if (!isSupabaseEnabled) {
      return;
    }

    // Snapshot now, as for archive().
    const record = structuredClone({
      id: this.matchID,
      game: this.gameName,
      stateVersion: this.definition.stateVersion,
      data: this.savedData(),
    });
    const updatedAt = new Date();

    this.queueSave('save', () => saveLiveMatch(record, updatedAt));
  }

  // Resolves when all the saves requested so far have completed (successfully or not).
  get savesCompleted(): Promise<void> {
    return this.saveQueue;
  }

  private savedData(): SavedMatch {
    return {
      setupData: this.setupData,
      matchOptions: this.matchOptions,
      activeData: this.activeData,
      players: this.players.map((p) => p.savedData()),
      rematchSeed: this.rematchSeed,
      gameNumber: this.gameNumber,
    };
  }

  private queueSave(description: string, save: () => Promise<void>) {
    this.saveQueue = this.saveQueue.then(save).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'unknown error';
      console.error(`Failed to ${description} match ${this.matchID}: ${message}`);
    });
  }

  findPlayer(arg: { id: string } | { name: string } | { ws: WebSocket }): Player | undefined {
    if ('id' in arg) {
      return this.players.find((p) => p.id === arg.id);
    } else if ('name' in arg) {
      return this.players.find((p) => p.name === arg.name);
    } else {
      return this.players.find((p) => p.isConnected && p.getWs() === arg.ws);
    }
  }

  setResponseDelay(responseDelay: number) {
    this.responseDelay = responseDelay;
  }

  broadcastMatchState(trigger: WsResponseTrigger, errorInLastAction: string | null) {
    const response: WsServerResponse = {
      trigger,
      matchState: this.matchState(errorInLastAction),
      matchOptions: this.matchOptions,
    };

    const doIt = () => {
      for (const player of this.players) {
        if (player.isConnected) {
          sendServerResponse(player.getWs(), response);
        }
      }
    };
    if (this.responseDelay > 0) {
      setTimeout(doIt, this.responseDelay);
    } else {
      doIt();
    }
  }
}
