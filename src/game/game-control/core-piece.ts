import { GameType, CorePiece} from '../../interfaces'

class CorePieceFactory {
    private _lastUsedId: number;
    
    constructor() {
      this._lastUsedId = 0;
    }
  

    make(name: string, gameType: GameType) {
      ++this._lastUsedId;
      return new CorePiece(name, gameType, this._lastUsedId);
    }

    copy(corePiece: CorePiece) {
      return this.make(corePiece.name, corePiece.gameType);
    }
  }
  export { CorePieceFactory };
 
