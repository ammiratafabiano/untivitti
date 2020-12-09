import { CardTypeEnum } from './card-set.model';

export enum GameStatusEnum {
    Starting = 0,
    Running = 1
}

export class PlayerModel {
    name: string;
    isAdmin: boolean;
}

export class GameStateModel {
    code: string;
    type: CardTypeEnum;
    players: PlayerModel[];
}
