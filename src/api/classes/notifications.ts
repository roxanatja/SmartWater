import { Notification } from "../../type/Notification";
import { QueryMetadata } from "../types/common";
import { INotificationFilter, INotificationsGetParams } from "../types/notifications";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class NotificationsApiConector {
    private static root_path = "/notifications"

    static async get(params: INotificationsGetParams): Promise<{ data: Notification[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async markAsRead(params: INotificationFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.notificationId}/mark-as-read`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async markAllAsRead(): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/mark-all-as-read`)
            return res.data
        } catch (error) {
            return null
        }
    }
}