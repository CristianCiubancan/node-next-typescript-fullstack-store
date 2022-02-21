import { useRadio, Box } from "@chakra-ui/react";

const RadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w={"100%"}>
      <input {...input} />
      <Box
        {...checkbox}
        textAlign={"center"}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        textTransform={"capitalize"}
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}>
        {props.children}
      </Box>
    </Box>
  );
};
export default RadioCard;
