import smartwaterApi from "../api/SmartWaterApi";

export const GetDistricts = async () => {
    try{
        const {data} = await smartwaterApi.get('/districts');
        
        return data;
    }catch (e) {
        console.error(e);
    }
}