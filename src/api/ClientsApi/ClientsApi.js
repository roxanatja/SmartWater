import smartwaterApi from "../SmartWaterApi";

export const loadClients = async () => {
    try{
        const clients = await smartwaterApi.get('/clients');
    
        return clients;
    }catch (e) {
        console.error(e);
    }
}