import smartwaterApi from "../SmartWaterApi";

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
    }
}