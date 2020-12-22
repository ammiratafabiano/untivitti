export enum GameTypeEnum {
    Cucu = 0
}

export class GameModel {
    id: number;
    name: string;
    handCards: number;
    minPlayers: number;
    maxPlayers: number;
    clockwise: boolean;
    defaultBalance: number;
}
