import { LoanConsolidated, Loans } from "../../type/Loans/Loans";
import { QueryMetadata } from "../types/common";
import { ILoanBody, ILoanFilter, ILoansGetParams } from "../types/loans";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class LoansApiConector {
    private static root_path = "/loans"

    static async get(params: ILoansGetParams): Promise<{ data: Loans[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getConsolidated(params: ILoansGetParams): Promise<LoanConsolidated[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/consolidated${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: ILoanBody): Promise<{ id: string } | { error: string } | null> {
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

    static async update(params: ILoanBody & ILoanFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.loanId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async markReturned(params: ILoanFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.loanId}/markReturned`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async returnAll(params: { data: { client: string; } }): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/returnAll`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: ILoanFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.loanId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}