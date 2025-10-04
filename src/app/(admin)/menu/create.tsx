import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [errors, setErrors] = useState("");

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const validateInput = () => {
    setErrors("");

    if (!name) {
      setErrors("Name is required");
      return false;
    }

    if (!price) {
      setErrors("Price is required");
      return false;
    }

    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number");
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    console.log("imagePath -------->", imagePath);

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );

    resetFields();
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    console.log("imagePath -------->", imagePath);

    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onDelete = () => {
    Alert.alert("Confirm", "Are you sure to delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: doDelete,
      },
    ]);
  };

  const doDelete = () => {
    console.log("OnDelete ");

    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log("pickImage -----------> uri:", result.assets[0].uri);

      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    console.log("uploadImage ---------> image:", image);

    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await new File(image).base64();

    // const base64 = await FileSystem.readAsStringAsync(image, {
    //   encoding: "base64",
    // });

    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log("uploadImage ---------> data:", data);

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />

      {/* <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      /> */}

      <RemoteImage
        path={image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />

      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        placeholder="Price"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={setPrice}
      />

      <Text style={{ color: "red" }}>{errors}</Text>

      <Button
        onPress={onSubmit}
        text={isUpdating ? "Update" : "Create"}
      ></Button>

      {isUpdating && (
        <Text style={styles.textButton} onPress={onDelete}>
          Delete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },

  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },

  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },

  label: {
    color: "gray",
    fontSize: 16,
  },

  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});

export default CreateProductScreen;
