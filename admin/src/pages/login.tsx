import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import LoginOperation from "../operations/user/login";
import { CurrentUser, setUser } from "../redux/features/user/userSlice";
import { useAppDispatch } from "../redux/hooks";

interface LoginFormValues {
  usernameOrEmail: string;
  email: string;
  password: string;
}

interface RegisterProps {
  currentUser: CurrentUser;
}

const Login: React.FC<RegisterProps> = ({ currentUser }) => {
  const dispatch = useAppDispatch();

  const methods = useForm<LoginFormValues>();

  const {
    handleSubmit,
    clearErrors,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const toast = useToast();

  const onSubmit = async (data: LoginFormValues) => {
    const responseData = await LoginOperation({ ...data, isAdmin: true });
    let error = undefined;
    if (responseData.errors) {
      error = responseData.errors[0];
    }
    if (error) {
      setError(error.field, { message: error.message });
    } else {
      if (responseData.message) {
        toast({
          title: "Account is not active. ",
          description: `${responseData.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        dispatch(setUser(responseData.user));
        window.location.href = "/";
      }
    }
  };

  return (
    <Layout currentUser={currentUser}>
      <FormProvider {...methods}>
        <form name="register" onSubmit={handleSubmit(onSubmit)}>
          <Flex p={2} justifyContent={"center"}>
            <Flex flexDirection={"column"} width={"sm"}>
              <Box m={2}>
                <InputField
                  defaultValue={undefined}
                  name={`usernameOrEmail`}
                  placeholder="Jhon"
                  label={`Username or Email`}
                  type="text"
                  onChange={(e) => {
                    setValue("usernameOrEmail", e.target.value);
                    clearErrors();
                  }}
                  validation={{
                    required: "Username is required",
                  }}
                />
              </Box>

              <Box m={2}>
                <InputField
                  defaultValue={undefined}
                  name={`password`}
                  placeholder="password"
                  label={`Password`}
                  type="password"
                  autoComplete="one-time-code"
                  validation={{
                    required: "Password is required",
                  }}
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    clearErrors();
                  }}
                />
              </Box>

              <Box m={2}>
                <Button
                  width={"100%"}
                  name="submit-button"
                  colorScheme={"green"}
                  type="submit">
                  Login
                </Button>
              </Box>
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default Login;
