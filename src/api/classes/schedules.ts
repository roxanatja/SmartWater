import { Schedule } from "../../type/Schedule";
import { IAssignScheduleBody, IScheduleBody, IScheduleFilter } from "../types/schedule";
import { ApiConnector } from "./api-conector";

export abstract class SchedulesApiConector {
    private static root_path = "/schedules"

    static async get(): Promise<Schedule[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/retrieve`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IScheduleBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IScheduleBody & IScheduleFilter): Promise<any | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.scheduleId}/edit`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async assign(params: IAssignScheduleBody): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.userId}/assignSchedule`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IScheduleFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.scheduleId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}