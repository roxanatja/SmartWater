import axios from "axios";

const smartwaterApi = axios.create({
    baseURL: 'https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1',
    headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI3NDQ0YzdiYzI5NTgxMWVjMTg2MTEiLCJvcmdhbml6YXRpb24iOiJqZXNodWEiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6W10sImNyZWF0ZWQiOjE3MDkxNjA4MDM4MzAsImlhdCI6MTcwOTE2MDgwMywiZXhwIjoxNzExNzUyODAzfQ.If2fs5WCT7GQ3pfXa5rT4qAyZ8Lo7VdP6ucNSKXoBFg",
    },
});

export default smartwaterApi;