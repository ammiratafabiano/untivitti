import { CardTypeEnum } from './card-set.model';
import { GameTypeEnum } from './game.model';
import { PlayerModel } from './player.model';

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
