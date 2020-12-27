import { GameType } from '../../interfaces'
type CorePieceName = string; // Could do better
type CorePieceId = number;

class CorePiece {

    name: CorePieceName;
    gameType: GameType;
    id: CorePieceId;

    constructor(name: CorePieceName,  gameType: GameType, id: CorePieceId) {
      this.id = id;
      this.name = name;
      this.gameType = gameType;
      Object.freeze(this);
    }
}
  
class CorePieceFactory {
    private _lastUsedId: number;
    
    constructor() {
      this._lastUsedId = 0;
    }
  

    make(name: CorePieceName, gameType: GameType) {
      ++this._lastUsedId;
      return new CorePiece(name, gameType, this._lastUsedId);
    }

    copy(corePiece: CorePiece) {
      return this.make(corePiece.name, corePiece.gameType);
    }
  }

  export default CorePiece;
  export { CorePieceFactory };
 