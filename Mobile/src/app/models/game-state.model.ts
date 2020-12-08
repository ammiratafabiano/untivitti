import { CardTypeEnum } from './card-set.model';

export class PlayerModel {
    name: string;
    isAdmin: boolean;
}

export class GameStateModel {
    code: string;
    type: CardTypeEnum;
    players: PlayerModel[];
}
