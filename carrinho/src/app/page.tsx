import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  // await auth.protect()

  return (
    <div>
      <header className="flex justify-aroud w-full">
        <h1>Carrinho</h1>

        <button />
      </header>
    </div>
  )
}
