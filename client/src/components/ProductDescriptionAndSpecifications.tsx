import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
} from "@chakra-ui/react";
import React from "react";
import { Product } from "../types/product";

interface ProductDescriptionAndSpecificationsProps {
  product: Product;
}
const ProductDescriptionAndSpecifications: React.FC<
  ProductDescriptionAndSpecificationsProps
> = ({ product }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              py={4}
              fontSize={18}
              fontWeight={"bold"}>
              Description
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{product.description}</AccordionPanel>
      </AccordionItem>

      {product.specifications.length ? (
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                flex="1"
                textAlign="left"
                py={4}
                fontSize={18}
                fontWeight={"bold"}>
                Specifications
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {product.specifications.map((specification) => (
              <Box key={specification.id} fontSize="sm">
                <chakra.span
                  fontWeight="bold"
                  mr={2}
                  textTransform={"capitalize"}>
                  {`${specification.name}:`}
                </chakra.span>
                <chakra.span color="gray.500">
                  {specification.value}
                </chakra.span>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
};

export default ProductDescriptionAndSpecifications;
