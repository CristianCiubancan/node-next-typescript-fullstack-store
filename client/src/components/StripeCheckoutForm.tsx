import { Box, Button, Spinner } from "@chakra-ui/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CompleteOrderOperation from "../operations/order/completeOrder";
import { CheckoutFormValues } from "../pages/checkout";
import { initialState, setCart } from "../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface StripeCheckoutFormProps {
  onClose: () => void;
  clientSecretKey: string;
  toast: any;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  clientSecretKey,
  toast,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { cartItems } = useAppSelector((state) => state.cart.value);

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const { watch, getValues } = useFormContext<CheckoutFormValues>();

  const { email, phoneNumber, fullName } = watch();

  const formData = getValues();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      clientSecretKey
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: fullName,
            email,
            phone: phoneNumber,
          },
        },
      },
      redirect: "if_required",
    });

    if (error)
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
    else {
      const completeOrder = await CompleteOrderOperation({
        ...formData,
        items: cartItems,
      });
      if (completeOrder.error) {
        setIsLoading(false);
        toast({
          title: "Error while submitting order.",
          description:
            "We've encountered an error while submitting your order. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setIsLoading(false);
        onClose();
        router.push("/order-complete");
        dispatch(setCart(initialState.value));
      }
    }
  };

  return (
    <>
      <PaymentElement
        id="payment-element"
        onReady={() => setIsDisabled(false)}
      />
      <Button
        onClick={handleSubmit}
        my={4}
        w={"100%"}
        colorScheme={"teal"}
        disabled={isLoading || !stripe || !elements || isDisabled}
        id="submit">
        {isLoading ? <Spinner /> : "Pay now"}
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <Box textAlign={"center"} mb={4} color={"red"} id="payment-message">
          {message}
        </Box>
      )}
    </>
  );
};

export default StripeCheckoutForm;
