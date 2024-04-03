import axios from "axios";

const smartwaterApi = axios.create({
  baseURL: "https://smartwater-dev-restructuring-b012a20c6ce9.herokuapp.com/v1",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI3NDQ0YzdiYzI5NTgxMWVjMTg2MTEiLCJvcmdhbml6YXRpb24iOiJqZXNodWEiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJiaWxscy5yZXRyaWV2ZSIsImJpbGxzLmNyZWF0ZSIsImJpbGxzLnVwZGF0ZSJdLCJjcmVhdGVkIjoxNzExOTMxMDAyODIyLCJpYXQiOjE3MTE5MzEwMDIsImV4cCI6MTcxNDUyMzAwMn0.P4upHrLV6c2oxT30FWdn7A4uGweYuhR_hp8zjJaMmTg",
  },
});

export default smartwaterApi;
