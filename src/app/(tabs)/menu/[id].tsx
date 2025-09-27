import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import products from "@assets/data/products";

import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";

import Button from "@components/Button";
import { defaultPizzaImage } from "@components/ProductListItem";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return <Text>Product not found</Text>;
  }

  const addToCart = () => {
    if (!product) return;

    addItem(product, selectedSize);
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      ></Image>

      <Text>Select size</Text>

      <View style={styles.sizes}>
        {sizes.map((s) => (
          <Pressable
            onPress={() => {
              setSelectedSize(s);
            }}
            style={[
              styles.size,
              { backgroundColor: selectedSize === s ? "gainsboro" : "white" },
            ]}
            key={s}
          >
            <Text
              style={[
                styles.sizeText,
                { color: selectedSize === s ? "black" : "gray" },
              ]}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>${product.price}</Text>

      <Button text="Add to cart" onPress={addToCart}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default ProductDetailsScreen;
