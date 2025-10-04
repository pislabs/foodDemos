// import {
//   initPaymentSheet,
//   presentPaymentSheet,
// } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import { supabase } from "./supabase";

const fetchPaymentSheetParams = async (amount: number) => {
  const { data, error } = await supabase.functions.invoke("payment-sheet", {
    body: { amount },
  });

  if (error) {
    console.warn("fetchPaymentSheetParams ----------> error:", error);
  }

  if (data) {
    console.log(data);
    return data;
  }
  Alert.alert("Error fetching payment sheet params");
  return {};
};

export const initialisePaymentSheet = async (amount: number) => {
  console.log("initialisePaymentSheet -------->, for: ", amount);

  const paymentSheetParams = await fetchPaymentSheetParams(amount);

  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    paymentSheetParams;

  console.log(
    "initialisePaymentSheet -------->fetchPaymentSheetParams: ",
    paymentSheetParams
  );

  if (!paymentIntent || !publishableKey) return;

  // const result = await initPaymentSheet({
  //   merchantDisplayName: "foodDemos",
  //   paymentIntentClientSecret: paymentIntent,
  //   customerId: customer,
  //   customerEphemeralKeySecret: ephemeralKey,
  //   defaultBillingDetails: {
  //     name: "rayl",
  //   },
  // });

  // console.log(result);
};

export const openPaymentSheet = async () => {
  // const { error } = await presentPaymentSheet();

  // if (error) {
  //   Alert.alert(error.message);
  //   return false;
  // }
  return true;
};
