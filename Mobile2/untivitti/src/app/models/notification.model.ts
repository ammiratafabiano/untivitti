export enum NotificationIcons {
    Close = 'close-outline',
    Login = 'log-in-outline',
    Logout = 'log-out-outline',
    Info = 'alert-circle-outline'
}

export class NotificationModel {
    message: string;
    icon?: string;
    disableButton?: boolean = false;
    time?: number = 2000;
}