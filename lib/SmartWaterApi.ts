import axios from "axios";
import "dotenv/config";

const smartwaterApi = axios.create({
  baseURL: process.env.SMARTWATER_API_BASE_URL,
  headers: {
    Authorization: process.env.SMARTWATER_API_AUTH_TOKEN,
  },
});
console.log("SMARTWATER_API_BASE_URL:", process.env.SMARTWATER_API_BASE_URL);
console.log(
  "SMARTWATER_API_AUTH_TOKEN:",
  process.env.SMARTWATER_API_AUTH_TOKEN
);

export default smartwaterApi;
