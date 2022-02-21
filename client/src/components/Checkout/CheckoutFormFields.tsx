import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import InputField from "../InputField";

interface CheckoutFormFieldsProps {}
const CheckoutFormFields: React.FC<CheckoutFormFieldsProps> = ({}) => {
  return (
    <Flex flexDirection={"column"} my={[4, 6, 8, 10]}>
      <Box>
        <InputField
          name={`fullName`}
          placeholder="Jhon Doe"
          label={`Full name`}
          type="text"
          validation={{
            required: "Full name is required",
          }}
        />
      </Box>

      <Box my={2}>
        <InputField
          name={`email`}
          placeholder="jhondoe@gmail.com"
          label={`Email address`}
          type="email"
          validation={{
            required: "Email is required",
          }}
        />
      </Box>

      <Box my={2}>
        <InputField
          name={`phoneNumber`}
          placeholder="0700020304"
          label={`Phone number`}
          type="text"
          validation={{
            required: "Phone number is required",
          }}
        />
      </Box>

      <Box my={2}>
        <InputField
          name={`address`}
          placeholder="street, number, building, appartment"
          label={`Full address`}
          type="text"
          validation={{
            required: "Address is required",
          }}
        />
      </Box>
      <Flex my={2}>
        <Box pr={2} w={"100%"}>
          <InputField
            name={`zipcode`}
            placeholder="000000"
            label={`ZIP / Postal code`}
            type="text"
            validation={{
              required: "ZIP/Postal code is required",
            }}
          />
        </Box>
        <Box w={"100%"}>
          <InputField
            name={`city`}
            placeholder="Bucharest"
            label={`City / Town`}
            type="text"
            validation={{
              required: "City is required",
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default CheckoutFormFields;
