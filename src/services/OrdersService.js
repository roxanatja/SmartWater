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
};

export const DeleteOrder = async (id) => {
    try {
        await smartwaterApi.delete(`/orders/${id}/delete`)
                .then((respuesta) => {
                    return respuesta.status;
                })
    } catch (e) {
        console.error(e);
        return e.response;
    }
};