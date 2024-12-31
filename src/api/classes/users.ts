import { Permission, User } from "../../type/User";
import { UserData } from "../../type/UserData";
import { QueryMetadata } from "../types/common";
import { ILoginBody, IPermissionBody, IPermissionsGetParams, IRegisterBody, IUserChangePaswordBody, IUserFilter, IUserPermissionsUpdateBody, IUsersGetParams, IUserUpdateBody } from "../types/users";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class UsersApiConector {
    private static root_path = "/users"

    static async get(params: IUsersGetParams): Promise<{ data: User[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getPermissions(params: IPermissionsGetParams): Promise<{ data: Permission[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/permissions${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createPermission(params: IPermissionBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/permissions/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async login(params: ILoginBody): Promise<{ token: string, user: UserData } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/login`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async registerUser(params: IRegisterBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/registerUser`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updatePermission(params: IPermissionBody & IUserFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/permission/${params.userId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updateUserPermissions(params: IPermissionsGetParams & IUserPermissionsUpdateBody & IUserFilter): Promise<{ mensaje: string } | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.userId}/permissions${query ? `?${query}` : ''}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updateUser(params: IUserUpdateBody & IUserFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.userId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async changePassword(params: IUserChangePaswordBody & IUserFilter): Promise<{ data: Permission[] } & QueryMetadata | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.userId}/changePassword`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async addFCM(params: { data: { toke: string; } } & IUserFilter): Promise<{ data: Permission[] } & QueryMetadata | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.userId}/addFCM`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IUserFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.userId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async deletePermission(params: IUserFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/permissions/${params.userId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}