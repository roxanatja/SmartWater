import { Zone } from "../../type/City";
import { QueryMetadata } from "../types/common";
import { IZoneAssignDistrictBody, IZoneBody, IZoneFilter, IZonesGetParams, IZoneUpdateBody } from "../types/zones";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ZonesApiConector {
    private static root_path = "/zones"

    static async get(params: IZonesGetParams): Promise<{ data: Zone[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IZoneBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async assignDistrict(params: IZoneAssignDistrictBody): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/asignate/district`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IZoneUpdateBody & IZoneFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.zoneId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IZoneFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.zoneId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}