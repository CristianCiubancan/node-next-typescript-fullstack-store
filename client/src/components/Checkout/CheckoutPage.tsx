import {
  AlertDialog,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CheckOrderOperation from "../../operations/order/checkOrder";
import CompleteOrderOperation from "../../operations/order/completeOrder";
import GetPaymentIntentOperation from "../../operations/order/getPaymentIntent";
import {
  CheckOrderOperationResponse,
  CheckoutFormValues,
} from "../../pages/checkout";
import {
  CartItem,
  initialState,
  setCart,
} from "../../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getScreenSize } from "../../utils/getScreenSize";
import CheckoutItemsUnavailableWindow from "./CheckoutItemsUnavailableWindow";
import CheckoutFormContent from "./CheckoutPageContent";

export interface HalfAvailableItem extends CartItem {
  availableQuantity: number;
}

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = ({}) => {
  const { cartItems } = useAppSelector((state) => state.cart.value);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [unavailableItems, setUnavailableItems] = useState<CartItem[]>([]);
  const [halfAvailableItems, setHalfAvailableItems] = useState<
    HalfAvailableItem[]
  >([]);

  const methods = useForm<CheckoutFormValues>();
  const { handleSubmit, watch } = methods;

  const toast = useToast();

  const dispatch = useAppDispatch();

  const paymentMethod = watch("paymentMethod");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const router = useRouter();

  const {
    isOpen: isUpdateCartOpen,
    onOpen: onUpdateCartOpen,
    onClose: onUpdateCartClose,
  } = useDisclosure();

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsLoading(true);
    const requestParams = {
      ...data,
      items: cartItems,
    };
    const resp: CheckOrderOperationResponse = await CheckOrderOperation(
      requestParams
    );

    if (!resp.halfAvailableItems.length && !resp.unavailableItems.length) {
      if (paymentMethod === "Card") {
        if (!clientSecret) {
          const paymentIntentSecret = await GetPaymentIntentOperation(
            requestParams
          );
          setClientSecret(paymentIntentSecret.clientSecret);
        }
        onOpen();
      } else if (paymentMethod === "Cash") {
        const finalResp = await CompleteOrderOperation(requestParams);
        if (finalResp.error) {
          toast({
            title: "Error while submitting order.",
            description:
              "We've encountered an error while submitting your order. Please try again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          dispatch(setCart(initialState.value));
          router.push("/order-complete");
        }
      }
    } else {
      setHalfAvailableItems(resp.halfAvailableItems);
      setUnavailableItems(resp.unavailableItems);
      dispatch(
        setCart({
          cartItems: resp.newCartItems,
          totalPrice: resp.newCartItems
            .map((item) =>
              parseFloat((parseFloat(item.price) * item.quantity).toFixed(2))
            )
            .reduce((partialSum, a) => partialSum + a, 0)
            .toFixed(2),
        })
      );
      onUpdateCartOpen();
    }
    setIsLoading(false);
  };

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY as string
  );

  if (!cartItems.length) {
    return (
      <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
        <Text
          w={"100%"}
          textAlign={"center"}
          fontSize={30}
          mt={4}
          fontWeight={"thin"}>
          {`Your cart is empty`}
        </Text>
        <NextLink href={"/store"}>
          <Box mt={6}>
            <Button>Continue shopping</Button>
          </Box>
        </NextLink>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef as any}
          onClose={onUpdateCartClose}
          isOpen={isUpdateCartOpen}
          isCentered>
          <AlertDialogOverlay />

          <CheckoutItemsUnavailableWindow
            halfAvailableItems={halfAvailableItems}
            unavailableItems={unavailableItems}
            onUpdateCartClose={onUpdateCartClose}
          />
        </AlertDialog>
      </Flex>
    );
  }

  return (
    <FormProvider {...methods}>
      <form name="checkout" onSubmit={handleSubmit(onSubmit)}>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef as any}
          onClose={onUpdateCartClose}
          isOpen={isUpdateCartOpen}
          isCentered>
          <AlertDialogOverlay />

          <CheckoutItemsUnavailableWindow
            halfAvailableItems={halfAvailableItems}
            unavailableItems={unavailableItems}
            onUpdateCartClose={onUpdateCartClose}
          />
        </AlertDialog>
        <CheckoutFormContent
          cancelRef={cancelRef}
          clientSecret={clientSecret}
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={onClose}
          paymentMethod={paymentMethod}
          stripePromise={stripePromise}
        />
      </form>
    </FormProvider>
  );
};

export default CheckoutPage;
