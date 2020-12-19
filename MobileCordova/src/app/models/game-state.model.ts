import { CardTypeEnum } from './card-set.model';
import { GameTypeEnum } from './game.model';

export class MoveModel {
    name: string;
    id: number;
    disabled?: boolean;
    icon: string;
    side: string;
    status: boolean;
}

export class PlayerModel {
    name: string;
    isAdmin: boolean;
    canMove: boolean;
    moves: MoveModel[];
    cards: number[];
    visible: boolean;
    balance: number;
    ghost: boolean;
    uuid: string;
    timestamp: number;
}

export class GameStateModel {
    code: string;
    cardSet: CardTypeEnum;
    game: GameTypeEnum;
    status: boolean;
    players: PlayerModel[];
    money: boolean;
    round: number;
    cards: number[];
    ground: number[];
    activePlayers: number;
}
