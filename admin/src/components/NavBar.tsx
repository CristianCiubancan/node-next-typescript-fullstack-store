import { Box, Flex, Heading, Link, Text } from "@chakra-ui/layout";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { LegacyRef, useRef } from "react";
import LogoutOperation from "../operations/user/logout";
import { CurrentUser, resetUser } from "../redux/features/user/userSlice";
import { useAppDispatch } from "../redux/hooks";

interface NavBarProps {
  currentUser: CurrentUser;
}

export const NavBar: React.FC<NavBarProps> = ({ currentUser }) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useAppDispatch();

  const btnRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const toast = useToast();

  const isUserLoggedIn =
    currentUser.id !== 0 &&
    currentUser.id !== null &&
    currentUser.isAdmin === true
      ? true
      : false;

  return (
    <Flex
      justifyContent="center"
      zIndex={1}
      position="fixed"
      width="100%"
      height="4em"
      top={0}
      bg="teal"
      p={4}>
      <Flex flex={1} alignItems="center">
        <Box mr={"auto"} color="white">
          <Button
            ref={btnRef as LegacyRef<HTMLButtonElement>}
            colorScheme="teal"
            onClick={onOpen}>
            Menu
          </Button>
        </Box>

        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <Flex flexDirection={"column"}>
                  <NextLink href="/">
                    <Button colorScheme="gray" mt={2}>
                      Home
                    </Button>
                  </NextLink>
                  <NextLink href="/images">
                    <Button colorScheme="gray" mt={2}>
                      Images
                    </Button>
                  </NextLink>
                  <NextLink href="/categories">
                    <Button colorScheme="gray" mt={2}>
                      Categories
                    </Button>
                  </NextLink>
                  <NextLink href="/products">
                    <Button colorScheme="gray" mt={2}>
                      Products
                    </Button>
                  </NextLink>
                </Flex>
              </DrawerBody>
              <DrawerFooter>
                {!isUserLoggedIn ? (
                  <Flex flexDirection="column" w={"100%"}>
                    <NextLink href="/login">
                      <Button colorScheme="pink" mt={2}>
                        login
                      </Button>
                    </NextLink>
                    <NextLink href="/register">
                      <Button colorScheme="teal" mt={2}>
                        register
                      </Button>
                    </NextLink>
                  </Flex>
                ) : (
                  <Button
                    width={"100%"}
                    mt={4}
                    colorScheme={"pink"}
                    onClick={async () => {
                      const data = await LogoutOperation();
                      if (data.error) {
                        toast({
                          title: "Error.",
                          description: `${data.error.message} reason: ${data.error.reason}`,
                          status: "error",
                          duration: 9000,
                          isClosable: true,
                        });
                      } else {
                        dispatch(resetUser());
                        router.reload();
                      }
                    }}>
                    logout
                  </Button>
                )}
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>

        <Flex ml={"auto"}>
          {isUserLoggedIn ? (
            <Flex ml={"auto"}>
              <Text color="white" mr={1}>
                Hi,
              </Text>
              <Text color="white" fontWeight={"bold"}>
                {currentUser ? currentUser.username : null}
              </Text>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
};
