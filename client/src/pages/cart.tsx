import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import React from "react";
import CartItem from "../components/CartItem";
import Layout from "../components/Layout";
import { useAppSelector } from "../redux/hooks";
import { getScreenSize } from "../utils/getScreenSize";

interface CartProps {}

const Cart: React.FC<CartProps> = () => {
  const { cartItems, totalPrice } = useAppSelector((state) => state.cart.value);

  const screenSize = getScreenSize();

  if (!cartItems.length) {
    return (
      <Layout>
        <Flex
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}>
          <Text
            w={"100%"}
            textAlign={"center"}
            fontSize={30}
            mt={4}
            fontWeight={"thin"}>
            {`Your cart is empty`}
          </Text>
          <NextLink href={"/store"}>
            <Box mt={6}>
              <Button>Continue shopping</Button>
            </Box>
          </NextLink>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Cart</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta property="og:title" content="Cart" />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta property="og:description" content="Cart" />
        <meta name="description" content="Cart" />
        <meta
          property="og:image"
          content={`Latest and greatest products brought to you exclusively by HappyOctopus's Jelly Bracelets.`}
        />
      </Head>
      <Flex
        w={"100%"}
        flexDirection={screenSize.width >= 1024 ? "row" : "column"}
        backgroundColor={"gray.100"}>
        <Flex
          flexDirection={"column"}
          px={4}
          w={"100%"}
          backgroundColor={"white"}>
          {cartItems?.map((item, idx) => (
            <CartItem
              item={item}
              idx={idx}
              cartItems={cartItems}
              key={item.variationSku}
            />
          ))}
        </Flex>
        <Box w={screenSize.width >= 1024 ? "700px" : "100%"}>
          <Flex
            position={"sticky"}
            top={"4em"}
            flexDirection={"column"}
            backgroundColor={"gray.100"}
            px={10}
            py={10}>
            <Flex w={"100%"}>
              <Text>Products total</Text>
              <Text ml={"auto"}>{`${totalPrice} Lei`}</Text>
            </Flex>
            <Flex w={"100%"}>
              <Text>Delivery cost</Text>
              <Text ml={"auto"}>{`20 Lei`}</Text>
            </Flex>
            <Divider my={4} />
            <Flex w={"100%"}>
              <Text fontWeight={"semibold"}>Total</Text>
              <Text ml={"auto"} fontWeight={"bold"} fontSize={"xl"}>{`${
                totalPrice + 20
              } Lei`}</Text>
            </Flex>

            {screenSize.width >= 1024 ? (
              <NextLink href={"/checkout"}>
                <Button colorScheme={"purple"} mt={10}>
                  Checkout now
                </Button>
              </NextLink>
            ) : null}
          </Flex>
        </Box>

        {screenSize.width < 1024 ? (
          <NextLink href={"/checkout"}>
            <Button
              mx={10}
              bottom={2}
              position={"sticky"}
              colorScheme={"purple"}
              my={10}>
              Checkout now
            </Button>
          </NextLink>
        ) : null}
      </Flex>
    </Layout>
  );
};

export default Cart;
