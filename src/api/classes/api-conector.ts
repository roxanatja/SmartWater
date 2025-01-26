import axios, { AxiosHeaders, AxiosInstance } from "axios";
import Cookies from 'js-cookie';

export abstract class ApiConnector {
    private static axiosInstance: AxiosInstance | undefined;

    public static getInstance(): AxiosInstance {
        if (!this.axiosInstance) {
            const authToken = Cookies.get("token")

            const headers: AxiosHeaders = new AxiosHeaders()
            headers.setAccept("application/json")
            headers.setContentType("application/json")

            if (authToken) { headers.setAuthorization(authToken) }

            this.axiosInstance = axios.create({
                baseURL: `${process.env.REACT_APP_API_HEROKU}/v1`,
                headers
            });
        }

        return this.axiosInstance
    }

    public static authenticateInstance() {
        const authToken = Cookies.get("token")

        const headers: AxiosHeaders = new AxiosHeaders()
        headers.setAccept("application/json")
        headers.setContentType("application/json")

        if (authToken) { headers.setAuthorization(authToken) }

        this.axiosInstance = axios.create({
            baseURL: `${process.env.REACT_APP_API_HEROKU}/v1`,
            headers
        });
    }

    public static logoutInstance() {
        const headers: AxiosHeaders = new AxiosHeaders()
        headers.setAccept("application/json")
        headers.setContentType("application/json")

        this.axiosInstance = axios.create({
            baseURL: `${process.env.REACT_APP_API_HEROKU}/v1`,
            headers
        });
    }
}