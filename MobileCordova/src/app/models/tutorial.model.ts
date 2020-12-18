export enum TutorialTypeEnum {
  HomePage = 'HOME_PAGE',
  GamePage = 'GAME_PAGE',
  PlayersPage = 'PLAYERS_PAGE'
}

export class TutorialItemModel {
  title: string;
  subtitle?: string;
  icon?: string;
  img?: string;
}

export class TutorialSectionModel {
  title: string;
  items: TutorialItemModel[];
}

export class TutorialModel {
  type: TutorialTypeEnum;
  title = '';
  subtitle = '';
  sections: TutorialSectionModel[] = [];
}
