import { PlayerModel } from './player.model';

export class TeamModel {
    id: number;
    name: string;
    members: PlayerModel[];
    vote: boolean;
}
