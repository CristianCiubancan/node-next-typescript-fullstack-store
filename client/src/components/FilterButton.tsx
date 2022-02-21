import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { FilterAttribute } from "./StoreUtilityBar";

interface FilterButtonProps {
  attributes: FilterAttribute[];
}

const FilterButton: React.FC<FilterButtonProps> = ({ attributes }) => {
  const [filterAttributes, setFilterAttributes] = useState<FilterAttribute[]>(
    []
  );

  const router = useRouter();

  useEffect(() => {
    if (JSON.stringify(router.query) !== "{}") {
      const objArray: any[] = [];
      Object.keys(router.query).forEach((key) => {
        if (attributes.filter((attr) => attr.name === key).length > 0)
          objArray.push({
            name: key,
            values:
              typeof router.query[key] === "string"
                ? [router.query[key]]
                : router.query[key],
          });
      });
      setFilterAttributes(objArray);
    }
  }, [router.query]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Button
        ref={btnRef as any}
        colorScheme="teal"
        p={0}
        size={"lg"}
        onClick={onOpen}
        as={IconButton}
        icon={<FaFilter />}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef as any}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>

          <DrawerBody>
            <Accordion allowToggle>
              {attributes.map((attribute) => (
                <AccordionItem key={attribute.name}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {attribute.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex flexDirection={"column"}>
                      {attribute.values.map((value) => (
                        <Checkbox
                          isChecked={
                            filterAttributes
                              .filter((atr) => atr.name === attribute.name)[0]
                              ?.values.filter((va) => va === value)[0]?.length >
                            0
                          }
                          onChange={(e) => {
                            const currentStateAttr = filterAttributes.filter(
                              (fAttribute) => fAttribute.name === attribute.name
                            );
                            let currentAttr: FilterAttribute;
                            if (e.target.checked) {
                              currentAttr = currentStateAttr.length
                                ? {
                                    name: currentStateAttr[0].name,
                                    values: [
                                      ...currentStateAttr[0].values,
                                      value,
                                    ],
                                  }
                                : { name: attribute.name, values: [value] };
                            } else {
                              currentAttr = {
                                name: currentStateAttr[0].name,
                                values: [
                                  ...currentStateAttr[0].values.filter(
                                    (v) => v !== value
                                  ),
                                ],
                              };
                            }
                            if (currentAttr.values.length) {
                              setFilterAttributes([
                                ...filterAttributes.filter(
                                  (fa) => fa.name !== attribute.name
                                ),
                                currentAttr,
                              ]);
                            } else {
                              setFilterAttributes([
                                ...filterAttributes.filter(
                                  (fa) => fa.name !== attribute.name
                                ),
                              ]);
                            }
                          }}
                          key={value}>
                          {value}
                        </Checkbox>
                      ))}
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </DrawerBody>

          <DrawerFooter>
            <Flex flexDirection={"column"} w={"100%"}>
              <Button
                mt={2}
                colorScheme={"red"}
                w={"100%"}
                onClick={() => {
                  const formerParams: any[] = [];

                  Object.keys(router.query).forEach((key) => {
                    if (
                      attributes.filter((attr) => attr.name === key).length ===
                      0
                    )
                      formerParams.push(`${key}=${router.query[key]}`);
                  });

                  const newParams = [...formerParams].join("&");

                  router.push(`/store?${newParams}`);
                  onClose();
                }}>
                Reset filters
              </Button>

              <Button
                mt={2}
                colorScheme={"teal"}
                w={"100%"}
                onClick={() => {
                  const formerParams: any[] = [];

                  Object.keys(router.query).forEach((key) => {
                    if (
                      attributes.filter((attr) => attr.name === key).length ===
                      0
                    )
                      formerParams.push(`${key}=${router.query[key]}`);
                  });

                  const params = filterAttributes
                    .map((attr) => {
                      return attr.values.map(
                        (value) => `${attr.name}=${value}`
                      );
                    })
                    .flat();

                  const newParams = [...formerParams, ...params].join("&");

                  router.push(`/store?${newParams}`);
                  onClose();
                }}>
                Filter
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterButton;
