import Head from "next/head";
import React from "react";
import CheckoutPage from "../components/Checkout/CheckoutPage";
import Layout from "../components/Layout";
import { CartItem } from "../redux/features/cart/cartSlice";

export interface HalfAvailableItem extends CartItem {
  availableQuantity: number;
}

export interface CheckOrderOperationResponse {
  availableItems: CartItem[];
  unavailableItems: CartItem[];
  halfAvailableItems: HalfAvailableItem[];
  newCartItems: CartItem[];
}

interface CheckoutProps {}

export interface CheckoutFormValues {
  paymentMethod: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  zipcode: string;
  city: string;
}

const Checkout: React.FC<CheckoutProps> = () => {
  return (
    <Layout>
      <Head>
        <title>Checkout</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta property="og:title" content="Checkout" />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta property="og:description" content="Checkout" />
        <meta
          property="og:image"
          content={`Latest and greatest products brought to you exclusively by HappyOctopus's Jelly Bracelets.`}
        />
      </Head>
      <CheckoutPage />
    </Layout>
  );
};

export default Checkout;
