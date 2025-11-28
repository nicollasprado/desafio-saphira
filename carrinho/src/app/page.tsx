"use client";

import ICart from "@/interfaces/ICart";
import IProduct from "@/interfaces/IProduct";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Pagination } from "rsuite";
import ProductCard from "../components/ProductCard";
import getCartIdFromStorage from "@/util/getCartIdFromStorage";
import saveCartIdInStorage from "@/util/saveCartIdInStorage";
import { Plus } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import NewProductModal from "@/components/NewProductModal";

export default function Home() {
  const [cart, setCart] = useState<ICart>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6 });
  const [totalProducts, setTotalProducts] = useState(0);
  const [showNewProduct, setShowNewProduct] = useState(false);

  useEffect(() => {
    const cartId = getCartIdFromStorage();

    const createCart = async () => {
      const res = await axios.post("/api/cart");
      setCart(res.data);
      if (res.data?.id) {
        saveCartIdInStorage(res.data.id);
      }
    };

    if (!cartId) {
      createCart();
      return;
    }

    const fetchCart = async () => {
      const res = await axios.get(`/api/cart/${cartId}`);
      setCart(res.data);
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("api/products", {
        params: { page: pagination.page, limit: pagination.limit },
      });
      setProducts(res.data.products);
      setTotalProducts(res.data.totalCount);
    };

    fetchProducts();
  }, [pagination]);

  if (!cart) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="w-full h-full">
      <header className="flex justify-around items-center w-full p-4 border-b border-b-[#cacaca7c]">
        <h1>Meu Ecommerce</h1>
      </header>

      <main className="flex gap-4 bg-slate-100 h-full p-4">
        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setShowNewProduct(true)}>
              <Plus /> Novo Produto
            </Button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center">
            <Pagination
              total={totalProducts}
              activePage={pagination.page}
              limit={pagination.limit}
              onChangePage={(page) =>
                setPagination((prev) => ({ ...prev, page }))
              }
              prev
              next
            />
          </div>
        </section>

        <CartSidebar cart={cart} />
      </main>

      <NewProductModal
        open={showNewProduct}
        onClose={() => setShowNewProduct(false)}
        onCreated={(p) => setProducts((prev) => [p, ...prev])}
      />
    </div>
  );
}
