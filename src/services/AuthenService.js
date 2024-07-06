import smartwaterApi from "../api/SmartWaterApi";

const AuthenticationService = {
  login: async (phoneNumber, password) => {
    try {
      const response = await smartwaterApi.post("/users/login", {
        phoneNumber,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
};

export default AuthenticationService;
