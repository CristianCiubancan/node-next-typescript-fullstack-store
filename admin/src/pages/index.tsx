import { Accordion, Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Layout from "../components/Layout";
import OrderItem from "../components/OrderItem";
import CutomRadioGroup from "../components/Radio/CustomRadioGroup";
import EditOrderStatusOperation from "../operations/order/editOrderStatus";
import GetOrdersOperation from "../operations/order/getOrders";
import { CurrentUser } from "../redux/features/user/userSlice";
import { Order } from "../types/order";

interface IndexProps {
  currentUser: CurrentUser;
}

export interface UpdateOrderStatusData {
  status: string;
  order: Order;
}

const Index: React.FC<IndexProps> = ({ currentUser }) => {
  const methods = useForm();

  const [areCategoriesLoading, setAreCategoriesLoading] =
    useState<boolean>(true);

  const [orders, setOrders] = useState<Order[]>([]);

  const { control, watch } = methods;

  const watchAllFields = watch("mode");

  const toast = useToast();

  const fetchOrders = async (status: string = "new") => {
    const ordersResp = await GetOrdersOperation(status);

    if (ordersResp.error) {
      toast({
        title: "Error accoured.",
        description: ordersResp.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setOrders(ordersResp);
    }
  };

  const updateOrderStatus = async (data: UpdateOrderStatusData) => {
    const resp = await EditOrderStatusOperation(data);

    if (resp.error) {
      toast({
        title: "Error accoured.",
        description: resp.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      fetchOrders(watchAllFields);
    }
  };

  useEffect(() => {
    setAreCategoriesLoading(true);
    fetchOrders(watchAllFields);
    setAreCategoriesLoading(false);
  }, [watchAllFields]);

  return (
    <Layout currentUser={currentUser}>
      <Flex flexDirection={"column"} width={"100%"}>
        <Flex px={4} my={2} w={"100%"}>
          <FormProvider {...methods}>
            <form style={{ width: "100%" }}>
              <CutomRadioGroup
                control={control}
                defaultValue={"new"}
                values={["new", "sent", "complete", "canceled"]}
                name={"mode"}
              />
            </form>
          </FormProvider>
        </Flex>

        <Flex mt={2} flexDir={"column"} alignItems={"center"} w={"100%"} p={2}>
          {areCategoriesLoading ? <Spinner /> : null}
          <Accordion allowToggle w={"100%"}>
            {orders.map((order) => (
              <Box key={order.id}>
                <OrderItem
                  order={order}
                  updateOrderStatus={updateOrderStatus}
                />
              </Box>
            ))}
          </Accordion>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Index;
