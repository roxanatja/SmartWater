import smartwaterApi from "../api/SmartWaterApi";

export const GetItems = async () => {
    try{
        const { data } = await smartwaterApi.get('/items?pageSize=3000');
    
        return data;
    }catch (e) {
        console.error(e);
        return e.response;
    }
};