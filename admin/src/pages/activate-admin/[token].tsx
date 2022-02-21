import { useToast } from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/Layout";
import ConfirmAdminOperation from "../../operations/user/confirmAdmin";
import { CurrentUser } from "../../redux/features/user/userSlice";
import { wrapper } from "../../redux/store";

interface ActivateAdminProps {
  currentUser: CurrentUser;
  message: string;
  isError: boolean;
}

const ActivateAdmin: React.FC<ActivateAdminProps> = ({
  currentUser,
  message,
  isError,
}) => {
  const toast = useToast();

  toast({
    description: message,
    status: isError ? "error" : "success",
    duration: 4000,
    isClosable: true,
    onCloseComplete: () => {
      window.location.href = "/";
    },
  });

  return <Layout currentUser={currentUser}></Layout>;
};

export default ActivateAdmin;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { message, isError } = await ConfirmAdminOperation(
      context.query.token as string
    );

    return { props: { message, isError } };
  }
);
