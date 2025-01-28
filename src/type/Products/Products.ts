import { CategoryProduct } from "./Category";
import { UnitMeasure } from "./UnitMeasure";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceBusiness: number;
  imageUrl: string;
  category: Partial<CategoryProduct> | string;
  unitMeasure: Partial<UnitMeasure> | string;
}
export default Product;
