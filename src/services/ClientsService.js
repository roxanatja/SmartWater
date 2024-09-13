import smartwaterApi from "../api/SmartWaterApi";

export const loadClients = async () => {
    try {
        const { data } = await smartwaterApi.get('/clients?pageSize=3000');

        return data;
    } catch (e) {
        console.error(e);
    }
};

export const GetClientById = async (id) => {
    try {
        const { data } = await smartwaterApi.get(`/clients/${id}`);

        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const saveClient = async (client) => {
    try {
        await smartwaterApi.post('/clients/register', client);
        return 200;
    } catch (e) {
        console.error(e);
        return e.response;
    }
};

export const updateClient = async (id, client) => {
    try {
        console.log(client)
        await smartwaterApi.put(`/clients/${id}`, client);

        return 200;
    } catch (e) {
        console.error(e);
        return e.response;
    }
};

export const DeleteClient = async (id) => {
    try {
        const data = await smartwaterApi.delete(`/clients/${id}`);

        return data;
    } catch (e) {
        console.error(e, e.response.data);
        return e.response;
    }
};