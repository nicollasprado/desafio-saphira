import ICartItemWithProduct from "./ICartItemWithProduct";

export default interface ICart {
  id: string;
  subtotal: number;
  total: number;
  cartItems: ICartItemWithProduct[];
}
