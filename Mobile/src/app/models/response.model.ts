export class ResponseModel<T> {
    success: boolean;
    data: T;
    errorCode: JoinErrorEnum | string;
}

export enum JoinErrorEnum {
    Duplicate = 'DUPLICATE',
    AlreadyStarted = 'ALREADY_STARTED',
    MaxPlayers = 'MAX_PLAYERS',
    GroupNotExists = 'GROUP_NOT_EXISTS'
}
