import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { Control } from "react-hook-form";
import { CheckoutFormValues } from "../../pages/checkout";
import CheckoutFormFields from "./CheckoutFormFields";
import CutomRadioGroup from "../Radio/CustomRadioGroup";

interface CheckoutFormProps {
  control: Control<CheckoutFormValues, object>;
}
const CheckoutForm: React.FC<CheckoutFormProps> = ({ control }) => {
  return (
    <Flex justifyContent={"center"} backgroundColor={"white"}>
      <Box w={700} maxW={"100%"} py={[4, 6, 8, 10]} px={[4, 6, 8, 10]}>
        <Flex w={"100%"} alignItems={"center"}>
          <Flex
            p={6}
            textAlign={"center"}
            boxSize={2}
            borderRadius={"full"}
            justifyContent={"center"}
            alignItems={"center"}
            borderWidth={2}
            borderColor={"black"}
            fontWeight={"bold"}>
            1
          </Flex>

          <Heading ml={[4, 6, 8, 10]} fontSize={[16, 20, 24, 28, 32]}>
            Payment method
          </Heading>
        </Flex>
        <Box my={[4, 6, 8, 10]}>
          <CutomRadioGroup
            control={control}
            values={[{ name: "Card" }, { name: "Cash" }]}
            name={"paymentMethod"}
            task={"payment"}
          />
        </Box>
        <Flex w={"100%"} alignItems={"center"}>
          <Flex
            p={6}
            textAlign={"center"}
            boxSize={2}
            borderRadius={"full"}
            justifyContent={"center"}
            alignItems={"center"}
            borderWidth={2}
            borderColor={"black"}
            fontWeight={"bold"}>
            2
          </Flex>

          <Heading ml={[4, 6, 8, 10]} fontSize={[16, 20, 24, 28, 32]}>
            Order details
          </Heading>
        </Flex>
        <CheckoutFormFields />
      </Box>
    </Flex>
  );
};

export default CheckoutForm;
