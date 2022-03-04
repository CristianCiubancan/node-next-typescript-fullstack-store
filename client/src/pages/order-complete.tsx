import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";
import NextLink from "next/link";
import Head from "next/head";
interface OrderCompleteProps {}

const OrderComplete: React.FC<OrderCompleteProps> = () => {
  return (
    <Layout>
      <Head>
        <title>Order complete</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta property="og:title" content="Order complete" />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta property="og:description" content="Order complete" />
        <meta name="description" content="Order complete" />
        <meta property="og:image" content="/favicon-96x96.png" />
      </Head>
      <Flex w={"100%"} flexDirection={"column"} alignItems={"center"}>
        <Image
          alt={"order-complete"}
          src={"/orderComplete.png"}
          w={"md"}
          maxW={"100%"}
        />
        <Text w={"xl"} maxW={"100%"} p={6} textAlign={"center"}>
          Thank you for choosing us! Your order is soon to be on your way. In
          the meantime we will send you an email containing your order details.
        </Text>
        <NextLink href={"/store"}>
          <Button colorScheme={"purple"}>Go browse so more</Button>
        </NextLink>
      </Flex>
    </Layout>
  );
};

export default OrderComplete;
