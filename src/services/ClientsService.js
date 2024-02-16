import smartwaterApi from "../api/SmartWaterApi";

export const loadClients = async () => {
    try{
        const {data} = await smartwaterApi.get('/clients');
    
        return data;
    }catch (e) {
        console.error(e);
    }
};

export const GetClientById = async (id) => {
    try{
        const {data} = await smartwaterApi.get(`/clients/${id}`);
    
        return data;
    }catch (e) {
        console.error(e);
        return null;
    }
};

export const saveClient = async (client) => {
    let resp;
    try{
        resp = await smartwaterApi.post('/clients', client);
    
        return resp;
    }catch (e) {
        console.error(e);
        return resp;
    }
};