import { CategoryProduct } from "./Category";
import { UnitMeasure } from "./UnitMeasure";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceBusiness: number;
  imageUrl: string;
  category: CategoryProduct | string;
  unitMeasure: UnitMeasure | string;
}
export default Product;
