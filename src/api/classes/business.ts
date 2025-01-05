import { Business } from "../../type/Business";
import { ApiConnector } from "./api-conector";

export interface IBusinessGetOneParams {
    businessId: string;
}

export interface IBusinessUpdateParams {
    data: {
        phoneNumber: string;
        email: string;
        address: string;
        imageUrl: string;
        companyName: string;
        city?: string;
        nit?: string;
    };
}

export abstract class BussinessApiConector {
    static async getBusiness(params: IBusinessGetOneParams): Promise<Business | null> {
        try {
            const res = await ApiConnector.getInstance().get(`/business/${params.businessId}`)
            return res.data as Business | null
        } catch (error) {
            return null
        }
    }

    static async updateBusiness(params: IBusinessUpdateParams): Promise<Business | null> {
        try {
            const res = await ApiConnector.getInstance().put(`/business`, params.data)
            return res.data as Business | null
        } catch (error) {
            return null
        }
    }

    static async information(): Promise<Business | null> {
        try {
            const res = await ApiConnector.getInstance().get(`/business/information`)
            return res.data as Business | null
        } catch (error) {
            return null
        }
    }
}