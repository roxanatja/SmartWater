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

export const GetDevolutions = async () => {
    try{
        const { data } = await smartwaterApi.get('/devolutions?pageSize=3000');
    
        return data;
    }catch (e) {
        console.error(e);
        return e.response;
    }
};

export const GetDevolutionsByUser = async (userId) => {
    try{
        const { data } = await smartwaterApi.get(`/devolutions?client=${userId}`);
    
        return data;
    }catch (e) {
        console.error(e);
        return e.response;
    }
};

export const registerDevolutions = async (devolution) => {
    try {
        const resp = await smartwaterApi.post('/devolutions/register', devolution)
                .then((respuesta) => {
                    return respuesta.status;
                });
                
        return resp;
    } catch (e) {
        console.error(e);
        return e.response;
    }
};