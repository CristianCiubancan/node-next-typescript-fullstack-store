import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Image,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UpdateOrderStatusData } from "../pages";
import { Order, OrderItem } from "../types/order";

interface LayoutProps {
  order: Order;
  updateOrderStatus: (data: UpdateOrderStatusData) => void;
}

const OrderItem: React.FC<LayoutProps> = ({ order, updateOrderStatus }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>();
  const [orderStatus, setOrderStatus] = useState<string>(order.status);

  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async () => {
    setIsUpdatingStatus(true);
    updateOrderStatus({ status: orderStatus, order });
    setIsUpdatingStatus(false);
  };
  return (
    <AccordionItem key={order.id}>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton
              backgroundColor={isExpanded ? "teal" : "white"}
              color={isExpanded ? "white" : "black"}
              _hover={{
                backgroundColor: isExpanded ? "teal.700" : "gray.100",
              }}>
              <Flex w={"100%"} flexDir={"column"}>
                <Box w={"sm"}>
                  <Text flex="1" textAlign="left">
                    {`email : ${order.email}`}
                  </Text>
                </Box>
                <Box w={"sm"}>
                  <Text flex="1" textAlign="left">
                    {`phone : ${order.phoneNumber}`}
                  </Text>
                </Box>
                <Box w={"sm"}>
                  <Text flex="1" textAlign="left">
                    {`items : ${order.orderItems.length}`}
                  </Text>
                </Box>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex w={"100%"} flexDir={"column"}>
              {order.orderItems.map((item) => (
                <Flex my={2} w={"100%"} key={item.variationSku}>
                  <Image
                    src={item.images[0]?.url}
                    fallbackSrc={item.images[0]?.placeholderUrl}
                    w={"50px"}
                    h={"50px"}
                  />
                  <Flex
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                    w={"100%"}>
                    <Text
                      mx={
                        2
                      }>{`${item.productName} - ${item.variationName}`}</Text>
                    <Text mx={2}>{`quantity : ${item.quantity}`}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
            <FormProvider {...methods}>
              <form
                name="get-paginated-products"
                onSubmit={handleSubmit(onSubmit)}>
                <Select
                  id={"orderBy"}
                  variant="outline"
                  mb={2}
                  value={orderStatus}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                  }}>
                  <option value="new">New</option>
                  <option value="sent">Sent</option>
                  <option value="complete">Complete</option>
                  <option value="canceled">Canceled</option>
                </Select>
                <Button
                  isLoading={isUpdatingStatus}
                  type={"submit"}
                  colorScheme={"teal"}
                  w={"100%"}>
                  Update order status
                </Button>
              </form>
            </FormProvider>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
export default OrderItem;
