import { GameType, CorePiece} from '../../interfaces'

class CorePieceFactory {
    private _lastUsedId: number;
    
    constructor() {
      this._lastUsedId = 0;
    }
  

    make(name: string, gameType: GameType) : CorePiece {
      const id = ++this._lastUsedId;
      return {name: name, gameType:gameType, id: id};
    }

    copy(corePiece: CorePiece) {
      return this.make(corePiece.name, corePiece.gameType);
    }
  }
  export { CorePieceFactory };
 
