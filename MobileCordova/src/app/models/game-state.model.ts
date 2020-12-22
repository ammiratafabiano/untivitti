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
    haveToPay: boolean;
    ghost: boolean;
    uuid: string;
    timestamp: number;
    isWinner: boolean;
    lastMove: number;
}

export class GameStateModel {
    code: string;
    cardSet: CardTypeEnum;
    game: GameTypeEnum;
    status: boolean;
    players: PlayerModel[];
    money: boolean;
    balance: number;
    round: number;
    cards: number[];
    ground: number[];
    activePlayers: number;
}
