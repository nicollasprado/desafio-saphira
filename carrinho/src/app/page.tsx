'use client'

import ICart from "@/interfaces/ICart";
import IProduct from "@/interfaces/IProduct";
import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "rsuite";
import ProductCard from "./components/ProductCard";

export default async function Home() {
  // await auth.protect()
  const [cart, setCart] = useState<ICart>()
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    const fetchCart = async () => {
      const res = await axios.get(`api/cart/by-user/${}`)

      setCart(res.data);
    }

    const fetchProducts = async () => {
      const res = await axios.get("api/products");

      setProducts(res.data)
    }

    fetchCart()
    fetchProducts()
  }, [])

  if(!cart) {
    return <p>Carregando dados...</p>
  }

  return (
      <div className="w-full">
        <header className="flex justify-around items-center w-full p-4 border-b border-b-[#cacaca7c]">
          <h1>Carrinho</h1>

          <div className="flex items-center gap-4">
            <p className="text-lg">Username</p>

            <Button appearance="ghost">
              <SignOutButton />
            </Button>
          </div>
        </header>

        <main className="flex gap-2">
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <div></div>
        </main>
      </div>
  )
}
