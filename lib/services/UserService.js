import smartwaterApi from "../api/SmartWaterApi";

export const GetUser = async () => {
    try{
        const {data} = await smartwaterApi.get('/users?pageSize=3000');
    
        return data.data;
    }catch (e) {
        console.error(e);
    };
};

export const DeleteUser = async (id) => {
    try{
        const {data} = await smartwaterApi.delete(`/users/${id}/delete`);
    
        return data.data;
    }catch (e) {
        console.error(e);
    };
}