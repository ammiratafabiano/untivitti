export enum GameTypeEnum {
    Cucu = 0,
    Bacara = 1
}

export class GameModel {
    id: GameTypeEnum;
    name: string;
    handCards: number;
    minPlayers: number;
    maxPlayers: number;
    clockwise: boolean;
    defaultBalance: number;
}
