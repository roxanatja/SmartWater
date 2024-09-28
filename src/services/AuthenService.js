import Cookies from "js-cookie";
import smartwaterApi from "../api/SmartWaterApi";

const AuthenticationService = {
  login: async (phoneNumber, password) => {
    try {
      const response = await smartwaterApi.post("/users/login", {
        phoneNumber,
        password,
      });

      if (!response.data.token) {
        throw new Error("Token de autenticación no recibido.");
      }

      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("userData", JSON.stringify(response.data.user), { expires: 7 });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  },

  logout: () => {
    // Eliminar cookies al cerrar sesión
    Cookies.remove("token");
    Cookies.remove("userData");
  },

  getToken: () => {
    return Cookies.get("token");
  },

  getUser: () => {
    const userData = Cookies.get("userData");
    if (userData) {
      try {
        return JSON.parse(userData);
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
};

export default AuthenticationService;
