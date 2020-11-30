type CorePieceName = string; // Could do better
type CorePieceId = number;

class CorePiece {
    name: CorePieceName;
    id: CorePieceId;

    constructor(name: CorePieceName, id: CorePieceId) {
      this.id = id;
      this.name = name;
      Object.freeze(this);
    }
  }
  
  class CorePieceFactory {
    private _lastUsedId: number;
    
    constructor() {
      this._lastUsedId = 0;
    }
  

    make(name: CorePieceName) {
      ++this._lastUsedId;
      return new CorePiece(name, this._lastUsedId);
    }

    copy(corePiece: CorePiece) {
      return this.make(corePiece.name);
    }
  }

  export { CorePiece, CorePieceFactory }
  export type { CorePieceId, CorePieceName }