import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import GetProductsOperation, {
  GetProductsRequestValues,
} from "../../operations/product/getProducts";
import { PaginatedProducts, PaginatedProductsForm } from "../../pages/products";
import { Category } from "../../types/product";

export interface ProductCategory extends Category {
  hierarchicalName: string;
}

interface ProductsPageTopBarProps {
  setSearchParams: React.Dispatch<
    React.SetStateAction<GetProductsRequestValues>
  >;
  setProductsArray: React.Dispatch<React.SetStateAction<PaginatedProducts>>;
  categories: ProductCategory[];
}

const ProductsPageTopBar: React.FC<ProductsPageTopBarProps> = ({
  setSearchParams,
  setProductsArray,
  categories,
}) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const methods = useForm<PaginatedProductsForm>();

  const { handleSubmit, register } = methods;

  const toast = useToast();

  const onSubmit = async (data: PaginatedProductsForm) => {
    setIsSearching(true);

    const newSearchParams = {
      ...data,
      categoryId: data.categoryId === "null" ? null : data.categoryId,
      cursor: null,
    };

    const products = await GetProductsOperation(newSearchParams);

    if (products.error) {
      toast({
        title: "Error",
        description: products.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setSearchParams(newSearchParams);

      setProductsArray(products);
    }

    setIsSearching(false);
  };

  return (
    <Flex
      position={"fixed"}
      top={"4em"}
      left={0}
      width={"100%"}
      zIndex={1}
      flexWrap={"wrap"}
      backgroundColor={"gray.100"}
      px={4}>
      <NextLink href="/create-product">
        <Button m={2} colorScheme={"teal"}>
          Create product
        </Button>
      </NextLink>
      <Spacer />

      <Flex whiteSpace={"nowrap"} alignItems={"center"}>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                mx={2}
                isActive={isOpen}
                as={Button}
                colorScheme="pink"
                rightIcon={<ChevronDownIcon />}>
                Search
              </MenuButton>
              <MenuList p={4}>
                <FormProvider {...methods}>
                  <form
                    name="get-paginated-products"
                    onSubmit={handleSubmit(onSubmit)}>
                    <FormLabel htmlFor="searchBy">Search by:</FormLabel>
                    <Select
                      id={"searchBy"}
                      variant="outline"
                      {...register("searchBy")}>
                      <option value="name">Name</option>
                      <option value="sku">SKU</option>
                    </Select>
                    <FormLabel mt={2} htmlFor="inCategory">
                      In category:
                    </FormLabel>
                    <Select
                      id={"inCategory"}
                      variant="outline"
                      {...register("categoryId")}>
                      <option value="null">Any category</option>
                      <option value="uncategorized">Uncategorized</option>
                      {categories.map((category) => {
                        return (
                          <option key={category.id} value={`${category.id}`}>
                            {category.hierarchicalName}
                          </option>
                        );
                      })}
                    </Select>

                    <FormLabel mt={2} htmlFor="orderBy">
                      Order:
                    </FormLabel>

                    <Select
                      id={"orderBy"}
                      variant="outline"
                      {...register("sort")}>
                      <option value="name:ASC">Name ASC </option>
                      <option value="name:DESC">Name DESC</option>
                      <option value='"minPrice"*"discountMultiplier":ASC'>
                        Price ASC
                      </option>
                      <option value='"minPrice"*"discountMultiplier":DESC'>
                        Price DESC
                      </option>
                    </Select>

                    <InputGroup variant="outline" my={2}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                      />
                      <Input
                        type="text"
                        placeholder="Search"
                        {...register("searchField")}
                      />
                    </InputGroup>
                    <Button
                      isLoading={isSearching}
                      type={"submit"}
                      colorScheme={"teal"}
                      w={"100%"}>
                      Go
                    </Button>
                  </form>
                </FormProvider>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
};

export default ProductsPageTopBar;
