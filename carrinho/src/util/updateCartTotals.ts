import prisma from "@/lib/prisma";

const updateCartTotals = async (cartId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const newTotals = {
    subtotal: 0,
    total: 0,
  };

  cart!.cartItems.forEach((item) => {
    newTotals.subtotal += item.product.price * item.quantity;
  });

  newTotals.total += newTotals.subtotal;

  await prisma.cart.update({
    where: { id: cartId },
    data: {
      subtotal: newTotals.subtotal,
      total: newTotals.total,
    },
  });
};

export default updateCartTotals;
