import { GameType, CorePiece} from '../../interfaces'

class CorePieceFactory {
    
    make(name: string, gameType: GameType) : CorePiece {
      return {name: name, gameType:gameType};
    }

    copy(corePiece: CorePiece) {
      return this.make(corePiece.name, corePiece.gameType);
    }
  }
  export { CorePieceFactory };
 
