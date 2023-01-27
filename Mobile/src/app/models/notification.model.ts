export enum NotificationIcons {
    Close = 'close-outline',
    Login = 'log-in-outline',
    Logout = 'log-out-outline',
    Info = 'alert-circle-outline',
    Start = 'play-outline',
    Pause = 'pause-outline',
    Ok = 'thumbs-up-outline',
    No = 'thumbs-up-outline',
    Swap = 'repeat-outline',
    Blocked = 'hand-left-outline',
    Watcher = 'eye-outline',
    Player = 'person-outline',
    Players = 'people-outline',
    Show = 'share-outline',
    Admin = 'albums-outline',
    Money = 'server-outline',
    Winner = 'trophy-outline'
}

export class NotificationModel {
    message: string;
    icon?: string;
    disableButton = false;
    time = 2000;
}
