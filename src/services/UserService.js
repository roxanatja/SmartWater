import smartwaterApi from "../api/SmartWaterApi";

export const GetUser = async () => {
    try{
        const {data} = await smartwaterApi.get('/users');
    
        return data.data;
    }catch (e) {
        console.error(e);
    };
};