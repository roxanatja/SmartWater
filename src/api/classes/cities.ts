import { City } from "../../type/City";
import { ApiConnector } from "./api-conector";

export abstract class CitiesApiConector {
    private static root_path = "/cities"

    static async getAll(): Promise<City[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getOne(params: { cityName: string }): Promise<{ cityId: string }[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/${params.cityName}`)
            return res.data
        } catch (error) {
            return null
        }
    }
}