interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: {
    _id: string;
    name: string;
    description: string;
    hiddenClient?: boolean;
  };
}
export default Product;
