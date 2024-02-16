import smartwaterApi from "../api/SmartWaterApi";

export const GetLoans = async () => {
    try{
        const {data} = await smartwaterApi.get('/loans');

        return data;
    }catch(e){
        console.error(e);
        return null;
    }
};

export const saveLoans = async (dataToSave) => {
    let resp = null;
    try {
        await smartwaterApi.post('/loans/register', dataToSave)
                .then((respuesta) => {
                    resp = respuesta.status;
                })

        return resp;
    } catch (e) {
        console.error(e);
        return resp;
    }
};