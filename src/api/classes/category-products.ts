import { ICategoryBody, ICategoryFilter } from "../types/category-products";
import { ApiConnector } from "./api-conector";
import { CategoryProduct } from "../../type/Products/Category";

export abstract class CategoryProductApiConector {
    private static root_path = "/category-products"

    static async get(): Promise<CategoryProduct[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async findOne(params: ICategoryFilter): Promise<CategoryProduct | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/find/${params.categoryId}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: ICategoryBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: ICategoryBody & ICategoryFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.categoryId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: ICategoryFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.categoryId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}