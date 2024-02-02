import smartwaterApi from "../SmartWaterApi";

export const GetProducts = async () => {
    try{
        const {data} = await smartwaterApi.get('/products');
    
        return data;
    }catch (e) {
        console.error(e);
    }
}