const saveCartIdInStorage = (id: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  const cartId = localStorage.getItem("cartId");

  if (cartId) {
    return;
  }

  localStorage.setItem("cartId", id);
};

export default saveCartIdInStorage;
