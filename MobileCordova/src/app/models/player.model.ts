import { MoveModel } from './move.model';

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
    team: number;
    bet: number;
}
