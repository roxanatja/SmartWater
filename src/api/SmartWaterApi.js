import axios from "axios";

const smartwaterApi = axios.create({
  baseURL: "https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI3NDQ0YzdiYzI5NTgxMWVjMTg2MTEiLCJvcmdhbml6YXRpb24iOiJqZXNodWEiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6W10sImNyZWF0ZWQiOjE3MjYwMDQ4MTI2NjcsImlhdCI6MTcyNjAwNDgxMiwiZXhwIjoxNzI4NTk2ODEyfQ.jaCnqvvaHLO1mjmBgnXDBcyCmSHX653qqPHcrQwXVYI",
  },
});

export default smartwaterApi;
