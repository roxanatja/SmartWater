import smartwaterApi from "../api/SmartWaterApi";

export const GetProducts = async () => {
    try{
        const {data} = await smartwaterApi.get('/products');
    
        return data;
    }catch (e) {
        console.error(e);
    }
};

export const GetProductsById = async (id) => {
    try{
        const {data} = await GetProducts();

        const product = data.find(product => product._id === id);
    
        return product;
    }catch (e) {
        console.error(e);
    }
}