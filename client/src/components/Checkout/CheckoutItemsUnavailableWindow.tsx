import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  Flex,
  Text,
  Image,
  Box,
  AspectRatio,
  Button,
} from "@chakra-ui/react";
import { HalfAvailableItem } from "../../pages/checkout";
import { CartItem } from "../../redux/features/cart/cartSlice";

interface CheckoutItemsUnavailableWindowProps {
  unavailableItems: CartItem[];
  halfAvailableItems: HalfAvailableItem[];
  onUpdateCartClose: () => void;
}

const CheckoutItemsUnavailableWindow: React.FC<
  CheckoutItemsUnavailableWindowProps
> = ({ halfAvailableItems, unavailableItems, onUpdateCartClose }) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>Oopsie...</AlertDialogHeader>
      <AlertDialogCloseButton />
      <AlertDialogBody>
        {unavailableItems.length ? (
          <Flex direction={"column"}>
            <Text>We ran out of stock on the following items:</Text>
            <Box>
              {unavailableItems.map((item) => (
                <Flex my={2} key={item.variationSku} borderWidth={1}>
                  <AspectRatio ratio={1} w={"60px"}>
                    <Image
                      alt={item.productName}
                      src={item.image}
                      fallbackSrc={item?.placeholderUrl}
                      objectFit={"cover"}
                    />
                  </AspectRatio>
                  <Box ml={2}>
                    <Text mt={1}>{`${item.productName}`}</Text>
                    {item.attributes.map((attribute, idx) => (
                      <Text
                        key={`${attribute.name + attribute.values[0].name}`}
                        mt={idx === 0 ? 2 : 0}
                        maxW={"100%"}>
                        {`${attribute.name} - ${attribute.values[0].name}`}
                      </Text>
                    ))}
                  </Box>
                </Flex>
              ))}
            </Box>
          </Flex>
        ) : null}
        {halfAvailableItems.length ? (
          <Flex flexDirection={"column"}>
            <Text>
              We still have some of those products laying around but not as many
              as you requested:
            </Text>
            <Box>
              {halfAvailableItems.map((item) => (
                <Flex my={2} key={item.variationSku} borderWidth={1}>
                  <AspectRatio ratio={1} w={"60px"}>
                    <Image
                      alt={item.productName}
                      src={item.image}
                      fallbackSrc={item?.placeholderUrl}
                      objectFit={"cover"}
                    />
                  </AspectRatio>
                  <Box ml={2}>
                    <Text mt={1}>{`${item.productName}`}</Text>
                    {item.attributes.map((attribute, idx) => (
                      <Text
                        key={`${attribute.name + attribute.values[0].name}`}
                        mt={idx === 0 ? 2 : 0}
                        maxW={"100%"}>
                        {`${attribute.name} - ${attribute.values[0].name}`}
                      </Text>
                    ))}
                  </Box>
                  <Flex
                    ml={"auto"}
                    mr={2}
                    flexDirection={"column"}
                    alignItems={"flex-end"}>
                    <Text mt={1}>{`requested: ${item.quantity}`}</Text>
                    <Text mt={1}>{`available: ${item.availableQuantity}`}</Text>
                  </Flex>
                </Flex>
              ))}
            </Box>
          </Flex>
        ) : null}
        <Text mt={1}>
          {`We have updated your cart to reflect our inventory.`}
        </Text>
        <Text mt={1}>
          {`If there are stil items left in your cart, you can continue checking out like this or you can go find some alternatives.`}
        </Text>
        <Button
          w={"100%"}
          my={2}
          colorScheme={"purple"}
          onClick={onUpdateCartClose}>
          OK
        </Button>
      </AlertDialogBody>
    </AlertDialogContent>
  );
};

export default CheckoutItemsUnavailableWindow;
