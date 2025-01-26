import axios from "axios";
import Cookies from "js-cookie";

const smartwaterApi = axios.create({
  baseURL: "https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1",
  headers: {
    Authorization: Cookies.get("token"),
  },
});

export default smartwaterApi;
