import { GameTypeEnum } from "./game.model";

export enum TutorialTypeEnum {
  HomePage = 'HOME_PAGE',
  GamePage = 'GAME_PAGE',
  PlayersPage = 'PLAYERS_PAGE'
}

export class TutorialItemModel {
  title: string;
  subtitle?: string;
  icon?: string;
  rotateIcon?: boolean;
  img?: string;
}

export class TutorialSectionModel {
  title: string;
  items: TutorialItemModel[];
}

export class TutorialModel {
  type: TutorialTypeEnum;
  game: GameTypeEnum;
  title = '';
  subtitle = '';
  sections: TutorialSectionModel[] = [];
}
