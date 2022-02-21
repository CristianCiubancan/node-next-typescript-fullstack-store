import { CheckoutFormValues } from "../../pages/checkout";
import { CartItem } from "../../redux/features/cart/cartSlice";

export interface CheckOrderRequestObject extends CheckoutFormValues {
  items: CartItem[];
}

const GetPaymentIntentOperation = async (reqObj: CheckOrderRequestObject) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/create-payment-intent`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reqObj),
    }
  );

  const data = await response.json();

  return data;
};

export default GetPaymentIntentOperation;
