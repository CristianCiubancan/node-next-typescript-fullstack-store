import { Box, Flex, HStack, useRadioGroup, Wrap } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { Value } from "../../types/product";
import RadioCard from "./RadioCard";

interface CutomRadioGroupProps {
  values: string[];
  defaultValue: string;
  name: string;
  control: any;
}

const CutomRadioGroup: React.FC<CutomRadioGroupProps> = ({
  values,
  defaultValue,
  name,
  control,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
    rules: { required: { value: true, message: "Required field" } },
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange: field.onChange,
    value: field.value,
  });

  const group = getRootProps();

  return (
    <Flex {...group} w={"100%"} flexWrap={"wrap"} justifyContent={"center"}>
      {values.map((value, idx) => {
        const radio = getRadioProps({
          value: value,
        });
        return (
          <Box mt={2} key={value} pl={idx === 0 ? 0 : 2}>
            <RadioCard {...radio}>{value}</RadioCard>
          </Box>
        );
      })}
    </Flex>
  );
};
export default CutomRadioGroup;
