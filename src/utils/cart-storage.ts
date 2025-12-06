import { Cart, CartItem } from "./types";

const CART_STORAGE_KEY = "nrc_cart";

/**
 * Get cart from local storage
 */
export function getCart(): Cart | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartJson) {
      return null;
    }
    return JSON.parse(cartJson) as Cart;
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return null;
  }
}

/**
 * Save cart to local storage
 */
export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(item: CartItem): void {
  const cart = getCart() || { items: [], updatedAt: new Date().toISOString() };
  
  // Check if item with same productId, size, and gender already exists
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.gender === item.gender
  );

  if (existingIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push(item);
  }

  saveCart(cart);
}

/**
 * Update item quantity in cart
 */
export function updateCartItem(
  productId: number,
  size: string,
  gender: string,
  quantity: number
): void {
  const cart = getCart();
  if (!cart) {
    return;
  }

  const itemIndex = cart.items.findIndex(
    (i) =>
      i.productId === productId &&
      i.size === size &&
      i.gender === gender
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
}

/**
 * Remove item from cart
 */
export function removeFromCart(
  productId: number,
  size: string,
  gender: string
): void {
  const cart = getCart();
  if (!cart) {
    return;
  }

  cart.items = cart.items.filter(
    (i) =>
      !(
        i.productId === productId &&
        i.size === size &&
        i.gender === gender
      )
  );

  saveCart(cart);
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Get total number of items in cart
 */
export function getCartItemCount(): number {
  const cart = getCart();
  if (!cart) {
    return 0;
  }
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get total price of cart
 */
export function getCartTotal(): number {
  const cart = getCart();
  if (!cart) {
    return 0;
  }
  return cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

