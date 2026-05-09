const keyForUser = (userId) => `cart_${userId || "guest"}`;

export const getCart = (userId) => {
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const setCart = (userId, cart) => {
  localStorage.setItem(keyForUser(userId), JSON.stringify(cart || []));
};

export const clearCart = (userId) => {
  localStorage.removeItem(keyForUser(userId));
};

export const addToCart = (userId, item) => {
  const cart = getCart(userId);
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx >= 0) {
    cart[idx] = {
      ...cart[idx],
      quantity: Number(cart[idx].quantity || 0) + Number(item.quantity || 0),
    };
  } else {
    cart.push(item);
  }
  setCart(userId, cart);
  return cart;
};
