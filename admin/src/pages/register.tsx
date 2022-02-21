import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import RegisterOperation from "../operations/user/register";
import { CurrentUser, setUser } from "../redux/features/user/userSlice";
import { useAppDispatch } from "../redux/hooks";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

interface RegisterProps {
  currentUser: CurrentUser;
}

const Register: React.FC<RegisterProps> = ({ currentUser }) => {
  const methods = useForm<RegisterFormValues>();

  const toast = useToast();

  const {
    handleSubmit,
    clearErrors,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    const responseData = await RegisterOperation({ ...data, isAdmin: true });
    let error = undefined;
    if (responseData.errors) {
      error = responseData.errors[0];
    }
    if (error) {
      setError(error.field, { message: error.message });
    } else {
      toast({
        title: "Registration Complete",
        description: `${responseData.message}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
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
                  name={`username`}
                  placeholder="Jhon"
                  label={`Username`}
                  type="text"
                  onChange={(e) => {
                    setValue("username", e.target.value);
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
                  name={`email`}
                  placeholder="jhon@doe.com"
                  label={`Email`}
                  type="email"
                  onChange={(e) => {
                    setValue("email", e.target.value);
                    clearErrors();
                  }}
                  validation={{
                    required: "Email is required",
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
                  Register
                </Button>
              </Box>
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default Register;
