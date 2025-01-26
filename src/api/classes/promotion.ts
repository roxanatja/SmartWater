import { Promotion } from "../../type/Promotion";
import { IPromotionBody, IPromotionFilter } from "../types/promotion";
import { ApiConnector } from "./api-conector";

export abstract class PromotionApiConector {
    private static root_path = "/promotions"

    static async getPromotions(): Promise<Promotion[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}`)
            if (res.data?.message) {
                return null
            } else {
                return res.data
            }
        } catch (error) {
            return null
        }
    }

    static async createPromotion(params: IPromotionBody): Promise<any | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updatePromotion(params: IPromotionBody & IPromotionFilter): Promise<any | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.promotionId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async deletePromotion(params: IPromotionFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.promotionId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}