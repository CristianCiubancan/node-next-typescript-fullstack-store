import { Flex, Text } from "@chakra-ui/layout";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import router from "next/router";
import React from "react";
import { NavCategory } from "../../types/navCategories";

interface DesktopAccordionWithChildrenComponentProps {
  category: NavCategory;
}

export const DesktopAccordionWithChildrenComponent: React.FC<
  DesktopAccordionWithChildrenComponentProps
> = ({ category, children }) => {
  return (
    <AccordionItem border="none">
      {({ isExpanded }) => (
        <>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <AccordionButton
              fontSize={16}
              whiteSpace={"nowrap"}
              pr={1}
              overflow={"hidden"}
              w={"100%"}
              textOverflow={"ellipsis"}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/store?categoryId=${category.id}`);
              }}
              fontWeight={"normal"}>
              <Text
                textAlign={"left"}
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}>
                {category.name}
              </Text>
            </AccordionButton>
            <h2>
              <AccordionButton
                px={0}
                py={1}
                _hover={{ backgroundColor: "gray.300" }}
                backgroundColor={"white"}
                borderRadius={"md"}>
                <AccordionIcon color={"teal"} />
              </AccordionButton>
            </h2>
          </Flex>
          <motion.div
            animate={{
              width: isExpanded ? "auto" : 1,
            }}
            transition={{ duration: 0.3 }}>
            <AccordionPanel p={0} bg="rgba(255,255,255,0.17)">
              {children}
            </AccordionPanel>
          </motion.div>
        </>
      )}
    </AccordionItem>
  );
};
