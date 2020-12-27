import { CardSetModel } from './card-set.model';
import { GameStateModel, PlayerModel } from './game-state.model';
import { GameModel } from './game.model';

export class SessionModel {
    group: GameStateModel;
    player: PlayerModel;
    game: GameModel;
    cardSet: CardSetModel;
}