import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Box,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../redux/hooks";

interface ReviewOrderProps {}
const ReviewOrder: React.FC<ReviewOrderProps> = ({}) => {
  const { cartItems } = useAppSelector((state) => state.cart.value);
  return (
    <Accordion allowToggle mt={4}>
      <AccordionItem>
        <h2>
          <AccordionButton px={0}>
            <Box flex="1" textAlign="left">
              Review order
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} px={0}>
          <Flex flexDirection={"column"}>
            {cartItems?.map((item, idx) => (
              <Flex key={item.variationSku} flexDirection={"column"}>
                <Flex w={"100%"} my={2}>
                  <Box>
                    <AspectRatio ratio={1} w={[50]}>
                      <Image
                        src={item.image}
                        fallbackSrc={item?.placeholderUrl}
                        objectFit={"cover"}
                      />
                    </AspectRatio>
                  </Box>

                  <Flex flexDir={"column"} ml={4} minW={0} w={"100%"}>
                    <Text minW={0} maxW={"100%"} fontSize={"md"}>
                      {`${item.productName}`}
                    </Text>
                    {item.attributes.map((attribute, idx) => (
                      <Text
                        fontSize={"sm"}
                        fontWeight={"light"}
                        key={`${attribute.name + attribute.values[0].name}`}
                        maxW={"100%"}
                        overflow={"hidden"}
                        whiteSpace={"nowrap"}>
                        {`${attribute.name} - ${attribute.values[0].name}`}
                      </Text>
                    ))}
                    <Text
                      maxW={"100%"}
                      fontWeight={"semibold"}
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}>
                      {`${parseFloat(item.price) * item.quantity} Lei`}
                    </Text>
                  </Flex>
                </Flex>
                {idx < cartItems.length - 1 ? <Divider /> : null}
              </Flex>
            ))}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ReviewOrder;
