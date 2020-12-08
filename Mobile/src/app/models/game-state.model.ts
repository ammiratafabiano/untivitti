export enum CardTypeEnum {
    Siciliane = 0
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
