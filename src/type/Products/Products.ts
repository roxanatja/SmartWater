import { CategoryProduct } from "./Category";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceBusiness: number;
  imageUrl: string;
  category: CategoryProduct | string;
}
export default Product;
