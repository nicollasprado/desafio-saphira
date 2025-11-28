import ICart from "@/interfaces/ICart";
import { formatPrice } from "@/util/formatPrice";
import { Button } from "rsuite";
import CartSidebarItem from "./CartSidebarItem";

interface Props {
  cart?: ICart | null;
}

export default function CartSidebar({ cart }: Props) {
  return (
    <aside className="w-80 bg-white p-4 shadow-md rounded">
      <h2 className="text-lg font-semibold mb-2">Seu Carrinho</h2>
      {!cart || cart.cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Seu carrinho está vazio</p>
      ) : (
        <div className="flex flex-col gap-3">
          <ul className="max-h-64 overflow-auto">
            {cart.cartItems.map((item) => (
              <CartSidebarItem key={item.id} item={item} />
            ))}
          </ul>

          <div className="border-t border-t-[#cacaca7c] pt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">
                R$ {formatPrice(cart.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Total</span>
              <span className="font-semibold">
                R$ {formatPrice(cart.total)}
              </span>
            </div>
          </div>

          <Button appearance="primary">Ir para o checkout</Button>
        </div>
      )}
    </aside>
  );
}
