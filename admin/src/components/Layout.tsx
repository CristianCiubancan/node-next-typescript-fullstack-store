import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { CurrentUser } from "../redux/features/user/userSlice";
import { NavBar } from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  currentUser: CurrentUser;
}
const Layout: React.FC<LayoutProps> = ({ children, variant, currentUser }) => {
  return (
    <Flex h="100%" width="100%" flexDirection="column" overflowY={"scroll"}>
      <NavBar currentUser={currentUser} />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Flex>
  );
};

export default Layout;
