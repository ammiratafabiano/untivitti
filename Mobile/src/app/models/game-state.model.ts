import { CardTypeEnum } from './card-set.model';
import { GameTypeEnum } from './game.model';

export class MoveModel {
    name: string;
    id: number;
}

export class PlayerModel {
    name: string;
    isAdmin: boolean;
    canMove: boolean;
    moves: MoveModel[];
    timestamp: number;
}

export class GameStateModel {
    code: string;
    cardSet: CardTypeEnum;
    game: GameTypeEnum;
    status: boolean;
    players: PlayerModel[];
}
