export enum WarningMoveTypeEnum {
    NotFinished = 'NOT_FINISHED'
}

export class WarningMoveModel {
    type: WarningMoveTypeEnum;
    description: string;
}

export class MoveModel {
    name: string;
    id: number;
    disabled?: boolean;
    icon: string;
    side: string;
    status: boolean;
    warnings: WarningMoveModel[];
}
