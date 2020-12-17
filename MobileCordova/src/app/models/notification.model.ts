export enum NotificationIcons {
    Close = 'close-outline',
    Login = 'log-in-outline',
    Logout = 'log-out-outline',
    Info = 'alert-circle-outline',
    Start = 'play-outline',
    Pause = 'pause-outline',
    Ok = 'thumbs-up-outline',
    Swap = 'repeat-outline',
    Blocked = 'hand-left-outline',
    Watcher = 'eye-outline',
    Player = 'person-outline',
    Show = 'share-outline',
    Admin = 'albums-outline'
}

export class NotificationModel {
    message: string;
    icon?: string;
    disableButton = false;
    time = 2000;
}
