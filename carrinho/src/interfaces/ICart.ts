import ICartItem from "./ICartItem";

export default interface ICart {
    id: string;
    subtotal: number
    total: number
    cartItems: ICartItem[]
    ownerId: string
}