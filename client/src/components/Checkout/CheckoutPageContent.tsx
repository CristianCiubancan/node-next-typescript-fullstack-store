import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Text,
  Button,
  Divider,
  Flex,
  toast,
} from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CheckoutFormValues } from "../../pages/checkout";
import { useAppSelector } from "../../redux/hooks";
import { getScreenSize } from "../../utils/getScreenSize";
import ReviewOrder from "../ReviewOrder";
import StripeCheckoutForm from "../StripeCheckoutForm";
import CheckoutForm from "./CheckoutForm";

interface CheckoutFormContentProps {
  paymentMethod: string;
  isLoading: boolean;
  cancelRef: any;
  onClose: () => void;
  isOpen: boolean;
  clientSecret: string | null;
  stripePromise: Promise<Stripe | null>;
}

const CheckoutFormContent: React.FC<CheckoutFormContentProps> = ({
  paymentMethod,
  isLoading,
  cancelRef,
  isOpen,
  clientSecret,
  stripePromise,
  onClose,
}) => {
  const screenSize = getScreenSize();

  const { totalPrice } = useAppSelector((state) => state.cart.value);
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <Flex
      w={"100%"}
      flexDirection={screenSize.width >= 1024 ? "row" : "column"}
      backgroundColor={"gray.100"}>
      <CheckoutForm control={control} />
      <Box w={screenSize.width >= 1024 ? "700px" : "100%"}>
        <Flex
          position={"sticky"}
          top={"4em"}
          flexDirection={"column"}
          backgroundColor={"gray.100"}
          px={10}
          py={10}>
          <Flex w={"100%"}>
            <Text>Products total</Text>
            <Text ml={"auto"}>{`${totalPrice} Lei`}</Text>
          </Flex>
          <Flex w={"100%"}>
            <Text>Delivery cost</Text>
            <Text ml={"auto"}>{`20 Lei`}</Text>
          </Flex>
          <Divider my={4} />
          <Flex w={"100%"}>
            <Text fontWeight={"semibold"}>Total</Text>
            <Text ml={"auto"} fontWeight={"bold"} fontSize={"xl"}>{`${
              totalPrice + 20
            } Lei`}</Text>
          </Flex>

          <ReviewOrder />

          {!paymentMethod || paymentMethod === "Cash" ? (
            <Button
              isLoading={isLoading}
              colorScheme={"teal"}
              mt={10}
              type="submit">
              Order now
            </Button>
          ) : (
            <>
              <Button
                isLoading={isLoading}
                colorScheme={"teal"}
                mt={10}
                type="submit">
                Order now
              </Button>
              <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef as any}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent>
                  <AlertDialogHeader>Complete payment</AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                    <Elements
                      options={{
                        clientSecret: clientSecret!,
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#0083a3",
                          },
                        },
                      }}
                      stripe={stripePromise}>
                      {clientSecret ? (
                        <StripeCheckoutForm
                          toast={toast}
                          onClose={onClose}
                          clientSecretKey={clientSecret}
                        />
                      ) : null}
                    </Elements>
                  </AlertDialogBody>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default CheckoutFormContent;
