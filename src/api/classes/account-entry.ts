import { Account } from "../../type/AccountEntry";
import { IAccountBody, IAccountFilter } from "../types/account-entry";
import { ApiConnector } from "./api-conector";

export abstract class AccountEntryApiConector {
    private static root_path = "/account-entry"

    static async get(): Promise<Account[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async findOne(params: IAccountFilter): Promise<Account | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/find/${params.accountId}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IAccountBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IAccountBody & IAccountFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.accountId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IAccountFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.accountId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}