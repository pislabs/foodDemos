import { randomUUID } from "expo-crypto";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { Tables } from "@/database.types";
import { CartItem, Product } from "@/types";
import { router } from "expo-router";

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (it) => it.product === product && it.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((it) =>
        it.id !== itemId ? it : { ...it, quantity: it.quantity + amount }
      )
      .filter((it) => it.quantity > 0);

    setItems(updatedItems);
  };

  const total = items.reduce(
    (acc, cur) => (acc += cur.product.price * cur.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    console.warn("checkout ------->", total);
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    console.log("saveOrderItems -------> start");

    const orderItems = items.map((it) => {
      return {
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
        size: it.size,
      };
    });

    insertOrderItems(orderItems, {
      onSuccess() {
        console.log("saveOrderItems -------> success");

        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
