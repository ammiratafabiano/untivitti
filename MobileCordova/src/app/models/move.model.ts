export enum WarningMoveTypeEnum {
    NotFinished = 'NOT_FINISHED',
    NotPaid = 'NOT_PAID',
    NotBet = 'NOT_BET'
}

export class WarningMoveModel {
    type: WarningMoveTypeEnum;
    description: string;
    block: boolean;
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
