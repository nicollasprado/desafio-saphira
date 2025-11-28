import IProduct from "@/interfaces/IProduct";
import { formatPrice } from "@/util/formatPrice";
import getCartIdFromStorage from "@/util/getCartIdFromStorage";
import axios from "axios";
import Image from "next/image";
import { Button } from "rsuite";

interface IProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: IProductCardProps) {
  const handleAddToCart = async (productId: string) => {
    const cartId = getCartIdFromStorage();
    await axios.post(`/api/cart/${cartId}/add-item`, {
      productId,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col gap-2 border border-[#cacaca7c] p-4 rounded-md w-fit">
      <p>{product.name}</p>

      {product.image_url && product.image_url.startsWith("http") ? (
        <div className="w-[20dvw] h-40">
          <Image
            src={product.image_url}
            alt="foto do produto"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="w-[20dvw] h-40 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Sem imagem</span>
        </div>
      )}

      <p>R$ {formatPrice(product.price)}</p>
      <Button appearance="primary" onClick={() => handleAddToCart(product.id)}>
        Adicionar
      </Button>
    </div>
  );
}
