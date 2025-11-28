export default interface ICartItemWithProduct {
  id: string;
  cartId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
}
