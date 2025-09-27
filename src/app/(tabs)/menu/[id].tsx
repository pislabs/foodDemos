import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{ title: "Details" }} />
      <Text>{id}</Text>
    </View>
  );
};

export default ProductDetailsScreen;
