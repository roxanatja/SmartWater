import { ReportClient, Client } from "../../type/Cliente/Client";
import { IClientGetParams, ISearchGetParams, IClientGetOneParams, IClientUpdateParams, IReportClientsParams, IClientRegisterParams, IClientMatchParams, IPosponeRenovation } from "../types/clients";
import { QueryMetadata } from "../types/common";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ClientsApiConector {
    private static root_path = "/clients"

    static async getClients(params: IClientGetParams): Promise<{ data: Client[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async searchClients(params: ISearchGetParams): Promise<{ data: Client[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/search${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async reportClients(params: IReportClientsParams): Promise<ReportClient[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report/reportclients${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getClient(params: IClientGetOneParams): Promise<Client | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/${params.clientId}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async registerClient(params: IClientRegisterParams): Promise<{ code: string; _id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async matchClient(params: IClientMatchParams): Promise<{ client: Client } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/matchClient`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updateClient(params: IClientUpdateParams): Promise<Client | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.clientId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async posponeClientRenovation(params: IPosponeRenovation): Promise<Client | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/posrenovation`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async deleteClient(params: IClientGetOneParams): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.clientId}`)
            return res.data
        } catch (error) {
            return null
        }
    }
}