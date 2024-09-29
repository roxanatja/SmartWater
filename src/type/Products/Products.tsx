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
  };
}
export default Product;
