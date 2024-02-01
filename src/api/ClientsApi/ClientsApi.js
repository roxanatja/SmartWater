import smartwaterApi from "../SmartWaterApi";

export const loadClients = async () => {
    try{
        const {data} = await smartwaterApi.get('/clients');
    
        return data;
    }catch (e) {
        console.error(e);
    }
}