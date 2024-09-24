import Cookies from "js-cookie";
import smartwaterApi from "../api/SmartWaterApi";

const AuthenticationService = {
  login: async (phoneNumber, password) => {
    try {
      const response = await smartwaterApi.post("/users/login", {
        phoneNumber,
        password,
      });

      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("userData", JSON.stringify(response.data), { expires: 7 });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  },

  logout: () => {
    Cookies.remove("token");
  },

  getToken: () => {
    return Cookies.get("token");
  },

  getUser: () => {
    return JSON.parse(Cookies.get("userData") || '{}');
  },

  isLoggedIn: () => {
    return !!Cookies.get("token");
  },
};

export default AuthenticationService;
