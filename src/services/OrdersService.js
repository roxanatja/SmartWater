import smartwaterApi from "../api/SmartWaterApi";

export const saveOrder = async (dataToSave) => {
    let resp = null;
    try {
        await smartwaterApi.post('/orders/register', dataToSave)
                .then((respuesta) => {
                    resp = respuesta.status;
                })

        return resp;
    } catch (e) {
        console.error(e);
        return resp;
    }
}