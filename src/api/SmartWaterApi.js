import axios from "axios";

const smartwaterApi = axios.create({
  baseURL: "https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI3NDQ0YzdiYzI5NTgxMWVjMTg2MTEiLCJvcmdhbml6YXRpb24iOiJqZXNodWEiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJiaWxscy5yZXRyaWV2ZSIsImJpbGxzLmNyZWF0ZSIsImJpbGxzLnVwZGF0ZSJdLCJjcmVhdGVkIjoxNzE5ODQyMDQ3NTAxLCJpYXQiOjE3MTk4NDIwNDcsImV4cCI6MTcyMjQzNDA0N30.QQU588YbYyY1FRjLPFLOKHNQ0rCZDWoosxTdTdIg4QI",
  },
});

export default smartwaterApi;
