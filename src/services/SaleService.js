import smartwaterApi from "../api/SmartWaterApi";

export const GetSales = async () => {
    try{
        const {data} = await smartwaterApi.get('/sales');
    
        return data;
    }catch (e) {
        console.error(e);
    };
}

export const saveSale = async (dataToSave) => {
    let resp = null;
    try {
        await smartwaterApi.post('/sales/register', dataToSave)
                .then((respuesta) => {
                    resp = respuesta.status;
                })

        return resp;
    } catch (e) {
        console.error(e);
        return resp;
    };
}