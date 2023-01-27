export enum CardTypeEnum {
  Siciliane = 0,
  Friends = 1,
  Family = 2
}

export class CardSetModel {
  id: CardTypeEnum;
  name: string;
  size: number;
  code: string;
  games: number[];
}
