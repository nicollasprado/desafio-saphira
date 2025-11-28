import ICartItemWithProduct from "@/interfaces/ICartItemWithProduct";
import { formatPrice } from "@/util/formatPrice";
import axios from "axios";
import { Trash } from "lucide-react";

interface ICartSidebarItemProps {
  item: ICartItemWithProduct;
}

export default function CartSidebarItem({ item }: ICartSidebarItemProps) {
  const formattedPrice = formatPrice(item.product.price * item.quantity);

  const handleRemove = async () => {
    await axios.delete(`/api/cart/${item.id}`);
    location.reload();
  };

  return (
    <li className="flex justify-between items-center text-sm py-1">
      <div className="flex items-center gap-4">
        <button type="button" className="text-red-500" onClick={handleRemove}>
          <Trash color="red" />
        </button>

        <div>
          <p className="font-medium">{item.product.name}</p>
          <p className="text-gray-500">Qtd: {item.quantity}</p>
        </div>
      </div>

      <div className="text-right">
        <p>R$ {formattedPrice}</p>
      </div>
    </li>
  );
}
