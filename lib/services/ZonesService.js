import smartwaterApi from "../SmartWaterApi";
export const GetZone = async () => {
    try{
        const {data} = await smartwaterApi.get('/zones?pageSize=3000');
        
        return data;
    }catch (e) {
        console.error(e);
    }
};