import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface SearchButtonProps {}

const SearchButton: React.FC<SearchButtonProps> = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const methods = useForm();

  const router = useRouter();

  const { handleSubmit, register } = methods;

  const { onOpen, isOpen, onClose } = useDisclosure();

  const onSubmit = async (data: any) => {
    setIsSearching(true);

    const routerParams = Object.entries(data).map(
      ([key, value]) => `${[key]}=${value}`
    );

    router.push(`/store?${routerParams.join("&")}`);

    setIsSearching(false);
    onClose();
  };

  return (
    <Menu gutter={12} onOpen={onOpen} onClose={onClose} isOpen={isOpen}>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={IconButton}
            p={0}
            aria-label="Search"
            colorScheme={"purple"}
            color={"white"}
            size="md"
            icon={<SearchIcon />}
          />
          {
            //position absoluto and right were set to fix overflowing on some devices
          }
          <MenuList w={"150px"} position={"absolute"} right={-10} p={4}>
            <FormProvider {...methods}>
              <form
                name="get-paginated-products"
                onSubmit={handleSubmit(onSubmit)}>
                <InputGroup variant="outline" my={2}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Search"
                    {...register("searchField")}
                    defaultValue={router.query.searchField}
                  />
                </InputGroup>
                <Button
                  isLoading={isSearching}
                  type={"submit"}
                  colorScheme={"purple"}
                  w={"100%"}>
                  Go
                </Button>
              </form>
            </FormProvider>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default SearchButton;
