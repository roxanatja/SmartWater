import smartwaterApi from "../api/SmartWaterApi";

export const DevolutionsRegister = async (devolution) => {
    try{
        const resp = await smartwaterApi.post('/devolutions/register', devolution);
    
        return resp;
    }catch (e) {
        console.error(e);
        return e.response;
    }
};