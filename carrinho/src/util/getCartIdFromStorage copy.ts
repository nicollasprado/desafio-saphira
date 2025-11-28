const getCartIdFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("cartId");
};

export default getCartIdFromStorage;
