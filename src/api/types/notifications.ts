import { Search } from "./common";

export interface INotificationsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
        read?: boolean;
    }
}

export interface INotificationFilter {
    notificationId: string;
}
