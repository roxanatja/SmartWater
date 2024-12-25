import Cookies from "js-cookie";
import { UsersApiConector } from "../classes/users";
import { ApiConnector } from "../classes/api-conector";
import { UserData } from "../../type/UserData";

const AuthService = {
    login: async (phoneNumber: string, password: string) => {
        try {
            const response = await UsersApiConector.login({ data: { password, phoneNumber } })

            if (!response?.token) {
                throw new Error("Token de autenticación no recibido.");
            }

            Cookies.set("token", response.token, { expires: 7 });
            Cookies.set("userData", JSON.stringify(response.user), { expires: 7 });

            ApiConnector.authenticateInstance()
            return response;
        } catch (error) {
            throw new Error("Error al iniciar sesión");
        }
    },
    logout: () => {
        Cookies.remove("token");
        Cookies.remove("userData");
        ApiConnector.logoutInstance()
    },
    getToken: () => {
        return Cookies.get("token");
    },
    getUser: (): UserData | null => {
        const userData = Cookies.get("userData");
        if (userData) {
            try {
                return JSON.parse(userData) as UserData;
            } catch (error) {
                console.error("Error al parsear los datos del usuario:", error);
                return null;
            }
        }
        return null;
    },
    isLoggedIn: () => {
        return !!Cookies.get("token");
    },
}

export { AuthService }