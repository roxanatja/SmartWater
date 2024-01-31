import smartwaterApi from "../SmartwaterAPI";

export const loadClients = async () => {
    try{
        const clients = await smartwaterApi.get('/clients');
    
        return clients;
    }catch (e) {
        console.error(e);
    }
}