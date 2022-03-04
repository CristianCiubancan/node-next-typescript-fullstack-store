import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Image,
  Text,
  Button,
  Flex,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import React, { LegacyRef, useRef, useState } from "react";
import { Product, Variation } from "../types/product";
import NextLink from "next/link";
import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { addItemToCart } from "../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface AddToCartButtonProps {
  product: Product;
  variation: Variation;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variation,
}) => {
  const [wasProductAdded, setWasProductAdded] = useState<boolean>(true);
  const { cartItems } = useAppSelector((state) => state.cart.value);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const dispatch = useAppDispatch();
  return (
    <Box>
      <Button
        disabled={variation.stock <= 0}
        onClick={() => {
          const cartItem = cartItems.filter(
            (item) => item.variationSku === variation.sku
          )[0];

          if (cartItem && cartItem.quantity >= variation.stock) {
            setWasProductAdded(false);
          } else {
            dispatch(
              addItemToCart({
                product: product,
                variation: variation,
                image: product.images[0]?.sizes.filter(
                  (size) => size.width === 300
                )[0]?.url,
                placeholderUrl: product.images[0]?.placeholderUrl,
              })
            );
            setWasProductAdded(true);
          }

          onOpen();
        }}
        colorScheme={"purple"}
        w={"100%"}>
        Add to cart
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />
        {wasProductAdded ? (
          <AlertDialogContent>
            <AlertDialogHeader textAlign={"center"}>
              <Box>
                <CheckIcon
                  backgroundColor={"gray.100"}
                  p={4}
                  borderRadius={"full"}
                  boxSize={20}
                  color={"green"}
                />
              </Box>
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Flex alignItems={"center"} flexDir={"column"}>
                <Heading textAlign={"center"} fontSize={24}>
                  Product was added to your cart!
                </Heading>
                <Text
                  textAlign={
                    "center"
                  }>{`${product.name} - ${variation.name}`}</Text>
                <Text textAlign={"center"}>
                  {`${(
                    variation.price * parseFloat(variation.discountMultiplier)
                  ).toFixed(2)} Lei`}
                </Text>
                <Image
                  py={2}
                  maxW="100%"
                  minH="100%"
                  w={150}
                  h={150}
                  backgroundPosition={"center"}
                  backgroundRepeat={"no-repeat"}
                  backgroundSize={"cover"}
                  filter={"auto"}
                  alt={product.name}
                  fallbackSrc={product.images[0]?.placeholderUrl}
                  objectFit={"cover"}
                  src={
                    product.images[0]?.sizes.filter(
                      (size) => size.width === 300
                    )[0]?.url
                  }
                />
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Flex flexDir={"column"} w={"100%"}>
                <NextLink href={"/cart"}>
                  <Button colorScheme="purple">Go to your cart</Button>
                </NextLink>
                <Button
                  mt={2}
                  ref={cancelRef as LegacyRef<HTMLButtonElement>}
                  onClick={onClose}
                  w={"100%"}>
                  Continue shopping
                </Button>
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent>
            <AlertDialogHeader textAlign={"center"}>
              <Box>
                <SmallCloseIcon
                  backgroundColor={"gray.100"}
                  p={4}
                  borderRadius={"full"}
                  boxSize={20}
                  color={"red.500"}
                />
              </Box>
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Flex alignItems={"center"} flexDir={"column"}>
                <Heading textAlign={"center"} fontSize={24}>
                  Product unavailable
                </Heading>
                <Text
                  mt={4}
                  textAlign={
                    "center"
                  }>{`Requested quantity for ${product.name} - ${variation.name} is no longer available`}</Text>
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Flex flexDir={"column"} w={"100%"}>
                <Button
                  mt={2}
                  ref={cancelRef as LegacyRef<HTMLButtonElement>}
                  onClick={onClose}
                  w={"100%"}>
                  Close
                </Button>
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </Box>
  );
};

export default AddToCartButton;
