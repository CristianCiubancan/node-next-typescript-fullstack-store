import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRadio, Box, Text, Flex, Icon } from "@chakra-ui/react";
import { BsCash, BsFillCreditCard2BackFill } from "react-icons/bs";

const PaymentRadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Flex
        {...checkbox}
        alignItems={"center"}
        cursor="pointer"
        _checked={{
          bg: "gray.100",
        }}
        px={5}
        py={8}>
        <Flex ml={4} alignItems={"center"} color={"teal"}>
          {props.children === "Cash" ? (
            <Icon boxSize={10} as={BsCash} />
          ) : (
            <Icon boxSize={10} as={BsFillCreditCard2BackFill} />
          )}
        </Flex>
        <Text ml={"auto"} mr={2} fontSize={"xl"}>
          {props.children}
        </Text>
        <Flex
          mx={2}
          justifyContent={"center"}
          alignItems={"center"}
          boxSize={6}
          borderRadius={"full"}
          borderWidth={1}>
          <CheckCircleIcon
            {...checkbox}
            boxSize={6}
            display={"none"}
            _checked={{ display: "unset" }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
export default PaymentRadioCard;
