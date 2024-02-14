import smartwaterApi from "../api/SmartWaterApi";

export const GetZone = async () => {
    try{
        const {data} = await smartwaterApi.get('/zones');
        
        return data;
    }catch (e) {
        console.error(e);
    }
};