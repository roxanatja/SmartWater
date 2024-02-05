import smartwaterApi from "../SmartWaterApi";

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
}