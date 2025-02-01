import { Sale, SaleConsolidatedItem, SaleProduct, SaleReport } from "../../type/Sale/Sale";
import { QueryMetadata } from "../types/common";
import { ISaleBody, ISaleFilter, ISalesConsolidatedGetParams, ISalesGetParams, ISalesProductsGetParams } from "../types/sales";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class SalesApiConector {
    private static root_path = "/sales"

    static async get(params: ISalesGetParams): Promise<{ data: Sale[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getSalesProducts(params: ISalesProductsGetParams): Promise<SaleProduct[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/productsales${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getSalesConsolidated(params: ISalesConsolidatedGetParams): Promise<SaleConsolidatedItem[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/consolidated${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getSalesReports(params: ISalesProductsGetParams): Promise<SaleReport[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report/reportsales${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: ISaleBody): Promise<{ id: string } | { error: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data, {
                validateStatus(status) {
                    if (status === 409 || status === 200) return true
                    return false
                },
            })

            if (res.status === 409) {
                return { error: "conflict" }
            } else {
                return res.data
            }
        } catch (error) {
            return null
        }
    }

    static async update(params: ISaleBody & ISaleFilter): Promise<{ mensaje: string } | { error: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.saleId}/update`, params.data, {
                validateStatus(status) {
                    if (status === 409 || status === 200) return true
                    return false
                }
            })
            if (res.status === 409) {
                return { error: "conflict" }
            } else {
                return res.data
            }
        } catch (error) {
            return null
        }
    }

    static async delete(params: ISaleFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.saleId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}