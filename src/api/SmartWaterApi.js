import axios from "axios";

const smartwaterApi = axios.create({
    baseURL: 'https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1',
    headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI3NDQ0YzdiYzI5NTgxMWVjMTg2MTEiLCJvcmdhbml6YXRpb24iOiJqZXNodWEiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6W10sImNyZWF0ZWQiOjE3MDY1NjU1MDU0NDMsImlhdCI6MTcwNjU2NTUwNSwiZXhwIjoxNzA5MTU3NTA1fQ.hw5EkuvRZYOq9eazjc8ZAEeQho3LOH5t3B4H5hH-ue8",
    },
});

export default smartwaterApi;