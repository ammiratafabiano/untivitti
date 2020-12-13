import { CardSetModel, CardTypeEnum } from './card-set.model';
import { GameTypeEnum } from './game.model';

export class MoveModel {
    name: string;
    id: number;
}

export class CardModel {
    set: CardSetModel;
    index: number;
}

export class PlayerModel {
    name: string;
    isAdmin: boolean;
    canMove: boolean;
    moves: MoveModel[];
    timestamp: number;
    cards: CardModel[];
    visible: boolean;
    balance: number;
}

export class GameStateModel {
    code: string;
    cardSet: CardTypeEnum;
    game: GameTypeEnum;
    status: boolean;
    players: PlayerModel[];
    money: boolean;
}
