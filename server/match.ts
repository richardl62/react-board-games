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

// A match is an instance of a game.
export class Match {
  readonly definition: GameControl;
  readonly matchID: string;

  readonly players: Player[];
  readonly random: RandomAPI;

  // Data that can be changed by a move or event.
  private activeData: ActiveMatchState;

  private responseDelay = 0;

  constructor(
    gameControl: GameControl,
    {
      matchID,
      numPlayers,
      setupData,
      randomAPI,
    }: {
      matchID: string;
      numPlayers: number;
      setupData: unknown;
      randomAPI: RandomAPI;
    },
  ) {
    this.definition = gameControl;
    this.matchID = matchID;
    this.random = randomAPI;

    const { playerData: setupPlayerData, ...activeMatchState } =
      makeActiveMatchState(gameControl, numPlayers, setupData, randomAPI);
    this.activeData = activeMatchState;

    this.players = [];
    for (let id = 0; id < numPlayers; ++id) {
      const playerId = this.activeData.ctxData.playOrder[id];
      const player = new Player(playerId);
      if (setupPlayerData?.[playerId] !== undefined) {
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
