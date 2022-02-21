import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  IconButton,
  Text,
  Image,
  Box,
  AspectRatio,
} from "@chakra-ui/react";
import React from "react";
import {
  CartItem,
  decreaseItemQuantity,
  increaseItemQuantity,
  removeItem,
} from "../redux/features/cart/cartSlice";
import { useAppDispatch } from "../redux/hooks";

interface CartItemProps {
  item: CartItem;
  cartItems: CartItem[];
  idx: number;
}
const CartItem: React.FC<CartItemProps> = ({ item, cartItems, idx }) => {
  const dispatch = useAppDispatch();
  return (
    <Flex w={"100%"} flexDirection={"column"}>
      <Flex w={"100%"} my={4}>
        <Box>
          <AspectRatio ratio={1} w={[100, 120, 150]}>
            <Image
              src={item?.image}
              fallbackSrc={item?.placeholderUrl}
              objectFit={"cover"}
            />
          </AspectRatio>
        </Box>

        <Flex
          flexDir={"column"}
          ml={4}
          minW={0}
          w={"100%"}
          position={"relative"}>
          <Text mt={1} overflow={"hidden"} whiteSpace={"nowrap"}>
            {`${item.productName}`}
          </Text>
          {item.attributes.map((attribute, idx) => (
            <Text
              key={`${attribute.name + attribute.values[0].name}`}
              mt={idx === 0 ? 2 : 0}
              maxW={"100%"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}>
              {`${attribute.name} - ${attribute.values[0].name}`}
            </Text>
          ))}
          <IconButton
            position={"absolute"}
            top={0}
            right={0}
            onClick={() => {
              dispatch(removeItem({ variationSku: item.variationSku }));
            }}
            aria-label="Delete item"
            icon={<DeleteIcon />}
            mb={"auto"}
          />
          <Text
            ml={"auto"}
            maxW={"100%"}
            fontWeight={"semibold"}
            overflow={"hidden"}
            whiteSpace={"nowrap"}>
            {`${parseFloat(item.price) * item.quantity} Lei`}
          </Text>
          <Flex
            mt={2}
            ml={"auto"}
            w={"100%"}
            overflow={"hidden"}
            justifyContent={"flex-end"}
            alignItems={"center"}>
            <IconButton
              disabled={item.quantity === 1}
              top={0}
              right={0}
              aria-label="Decrease quantity"
              onClick={() => {
                dispatch(
                  decreaseItemQuantity({
                    idx,
                    variationSku: item.variationSku,
                  })
                );
              }}
              icon={<MinusIcon />}
              mb={"auto"}
            />

            <Text mx={3} fontSize={"lg"} fontWeight={"semibold"}>
              {item.quantity}
            </Text>

            <IconButton
              disabled={item.stock <= item.quantity}
              top={0}
              right={0}
              onClick={() => {
                dispatch(
                  increaseItemQuantity({
                    idx,
                    variationSku: item.variationSku,
                  })
                );
              }}
              aria-label="Increase quantity"
              icon={<AddIcon />}
              mb={"auto"}
            />
          </Flex>
        </Flex>
      </Flex>
      {idx < cartItems.length - 1 ? <Divider /> : null}
    </Flex>
  );
};

export default CartItem;
