import { CardSetModel } from './card-set.model';
import { GameStateModel } from './game-state.model';
import { GameModel } from './game.model';
import { PlayerModel } from './player.model';

export class SessionModel {
    group: GameStateModel;
    player: PlayerModel;
    game: GameModel;
    cardSet: CardSetModel;
}