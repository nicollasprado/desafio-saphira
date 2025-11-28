import IProduct from "@/interfaces/IProduct";
import { formatPrice } from "@/util/formatPrice";
import Image from "next/image";
import { Button } from "rsuite";

interface IProductCardProps {
    product: IProduct
}

export default function ProductCard({product}: IProductCardProps) {
    return (
        <div className="flex flex-col gap-2">
            <p>{product.name}</p>

            <div className="w-100 h-40">
                <Image src={product.image_url} alt="foto do produto" fill className="object-contain"/>
            </div>

            <p>R$ {formatPrice(product.price)}</p>
            <Button>Adicionar</Button>
        </div>
    )
}