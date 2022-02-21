import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  useRadioGroup,
  Wrap,
} from "@chakra-ui/react";
import error from "next/error";
import { useController } from "react-hook-form";
import { Value } from "../../types/product";
import PaymentRadioCard from "./PaymentRadioCard";
import RadioCard from "./RadioCard";

interface CutomRadioGroupProps {
  values: Value[];
  name: string;
  control: any;
  task: string;
}

const CutomRadioGroup: React.FC<CutomRadioGroupProps> = ({
  values,
  name,
  control,
  task,
}) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules: { required: { value: true, message: "Required field" } },
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange: field.onChange,
    value: field.value,
    defaultValue: values.length === 1 ? values[0].name : undefined,
  });

  const group = getRootProps();

  return task === "attributes" ? (
    <FormControl isInvalid={!!fieldState.error}>
      <HStack {...group}>
        <Wrap>
          {values.map((value) => {
            const radio = getRadioProps({
              value: value.name,
            });
            return (
              <RadioCard key={value.id} {...radio}>
                {value.name}
              </RadioCard>
            );
          })}
        </Wrap>
      </HStack>

      {error ? (
        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
      ) : null}
    </FormControl>
  ) : (
    <FormControl isInvalid={!!fieldState.error}>
      <Flex
        flexDirection={"column"}
        borderWidth={!!fieldState.error ? 2 : 1}
        borderColor={!!fieldState.error ? "red" : "gray.200"}
        borderRadius={"md"}
        overflow={"hidden"}>
        {values.map((value, idx) => {
          const radio = getRadioProps({
            value: value.name,
          });
          return (
            <Box
              key={value.name}
              borderBottomWidth={idx !== values.length - 1 ? 1 : 0}>
              <PaymentRadioCard {...radio}>{value.name}</PaymentRadioCard>
            </Box>
          );
        })}
      </Flex>

      {error ? (
        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};
export default CutomRadioGroup;
