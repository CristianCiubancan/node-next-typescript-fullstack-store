import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NavCategory } from "../../types/navCategories";

interface MobileDrawerProps {
  categories: NavCategory[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ categories }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const router = useRouter();

  const [categoryElements, setCategoryElements] = useState<any>();

  const recursiveBuild = (categories: any[]) => {
    return categories.map((category) => {
      if (category.subCategory?.length > 0) {
        return (
          <AccordionItem border="none" key={category.id}>
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
                      onClose();
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
                      w={8}
                      _hover={{ backgroundColor: "teal.700" }}
                      backgroundColor={"teal"}
                      borderRadius={"md"}>
                      <AccordionIcon mx={"auto"} color={"white"} />
                    </AccordionButton>
                  </h2>
                </Flex>
                <motion.div
                  animate={{
                    width: isExpanded ? "auto" : 1,
                  }}
                  transition={{ duration: 0.3 }}>
                  <AccordionPanel p={0} bg="rgba(0,0,0,0.17)">
                    <Accordion allowToggle>
                      {recursiveBuild(category.subCategory)}
                    </Accordion>
                  </AccordionPanel>
                </motion.div>
              </>
            )}
          </AccordionItem>
        );
      } else {
        return (
          <AccordionItem key={category.id} border="none">
            <h2>
              <AccordionButton
                fontSize={16}
                fontWeight={"normal"}
                whiteSpace={"nowrap"}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/store?categoryId=${category.id}`);
                  onClose();
                }}
                overflow={"hidden"}
                textOverflow={"ellipsis"}>
                <Box flex="1" textAlign="left">
                  {category.name}
                </Box>
              </AccordionButton>
            </h2>
          </AccordionItem>
        );
      }
    });
  };

  useEffect(() => {
    setCategoryElements(recursiveBuild(categories));
  }, []);

  return (
    <>
      <IconButton
        ref={btnRef as any}
        colorScheme="teal"
        onClick={onOpen}
        aria-label="Search database"
        icon={<HamburgerIcon />}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef as any}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody mt={10}>
            <Accordion allowToggle>{categoryElements}</Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
