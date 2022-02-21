import {
  Accordion,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AccordionItemContainer from "../../components/AccordionComponents/AccordionItemContainer";
import ProductAttributes from "../../components/CreateProductComponents/productAttributes";
import ProductCategory from "../../components/CreateProductComponents/productCategory";
import ProductGeneralInfo from "../../components/CreateProductComponents/productGeneralInfo";
import ProductImages from "../../components/CreateProductComponents/productImages";
import ProductSpecifications from "../../components/CreateProductComponents/productSpecifications";
import ProductVariations from "../../components/CreateProductComponents/productVariations";
import Layout from "../../components/Layout";
import GetAllCategoriesOperation from "../../operations/category/getAllCategories";
import GetImagesOperation from "../../operations/images/getImages";
import GetProductOperation from "../../operations/product/getProduct";
import {
  CreateProduct,
  initialCreateProductState,
} from "../../redux/features/products/createProduct";
import {
  setEditProductImages,
  setEditProductState,
} from "../../redux/features/products/editProduct";
import { CurrentUser } from "../../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { wrapper } from "../../redux/store";
import { Category, Img, Variation } from "../../types/product";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { onProductCreateOrSubmitSubmit } from "../../utils/onProductCreateSubmit";
import { ProductFormFields } from "../create-product";

interface CreateProductProps {
  categories: Category[];
  currentUser: CurrentUser;
  images: Img[];
  product: CreateProduct | null;
  errorCode: string;
}

const CreateProduct: React.FC<CreateProductProps> = ({
  categories,
  currentUser,
  images,
  product,
  errorCode,
}) => {
  if (!product) {
    return (
      <Layout currentUser={currentUser}>
        <Flex flexDir={"column"} alignItems={"center"}>
          <Text m={2} textAlign={"center"}>
            There was an error with the requested product
          </Text>
          <NextLink href="/products">
            <Button m={2}>Go back to products page</Button>
          </NextLink>
        </Flex>
      </Layout>
    );
  }

  const {
    editProduct: { value: editProductStateLive },
  } = useAppSelector((state) => state);

  const [productImages, setProductImages] = useState<Img[]>(product.images);
  const [displayImageSelector, setDisplayImageSelector] =
    useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const methods = useForm<ProductFormFields>();

  const toast = useToast();

  const {
    reset,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(editProductStateLive);
  }, [editProductStateLive]);

  const firstError = Object.entries(errors).map(([_k, v]) => v)[0] as any;

  useEffect(() => {
    dispatch(setEditProductImages(productImages));
  }, [productImages]);

  if (categories[0].name === "error while fetching") {
    return (
      <Layout currentUser={currentUser}>
        <Text w={"100%"} textAlign={"center"} fontSize={18} fontWeight={"thin"}>
          {`error code ${errorCode} while fetching categories please refresh the page, if the problems persist contact administrator`}
        </Text>
      </Layout>
    );
  }

  return (
    <Layout currentUser={currentUser}>
      <FormProvider {...methods}>
        <form name="edit-product">
          <Accordion allowToggle m={2} defaultIndex={[0]}>
            <AccordionItemContainer
              color={"yellow.500"}
              title={"General information"}>
              <ProductGeneralInfo values={editProductStateLive} task={"edit"} />
            </AccordionItemContainer>
            <AccordionItemContainer color={"orange.500"} title={"Category"}>
              <ProductCategory
                categories={categories}
                values={editProductStateLive}
                task={"edit"}
              />
            </AccordionItemContainer>
            <AccordionItemContainer color={"green.500"} title={"Images"}>
              <ProductImages
                task={"edit"}
                images={images}
                productImages={productImages}
                setProductImages={setProductImages}
                displayImageSelector={displayImageSelector}
                setDisplayImageSelector={setDisplayImageSelector}
              />
            </AccordionItemContainer>
            <AccordionItemContainer color={"blue.500"} title={"Attributes"}>
              <ProductAttributes values={editProductStateLive} task={"edit"} />
            </AccordionItemContainer>

            <AccordionItemContainer color={"purple.500"} title={"Variations"}>
              <ProductVariations values={editProductStateLive} task={"edit"} />
            </AccordionItemContainer>

            <AccordionItemContainer color={"pink.500"} title={"Specifications"}>
              <ProductSpecifications
                values={editProductStateLive}
                task={"edit"}
              />
            </AccordionItemContainer>
          </Accordion>

          <FormControl p={2} isInvalid={!!firstError}>
            {firstError && (
              <FormErrorMessage mb={2}>
                {getErrorMessage(firstError)}
              </FormErrorMessage>
            )}
            <Button
              width={"100%"}
              isLoading={submitting}
              name="submit-button"
              colorScheme={"green"}
              onClick={async () => {
                onProductCreateOrSubmitSubmit(
                  editProductStateLive,
                  clearErrors,
                  setError,
                  trigger,
                  productImages,
                  setProductImages,
                  reset,
                  toast,
                  dispatch,
                  setSubmitting,
                  "edit"
                );
              }}
              type="button">
              Edit Product
            </Button>
          </FormControl>
        </form>
      </FormProvider>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const response = await GetAllCategoriesOperation();

    const imagesResponse = await GetImagesOperation();

    let getProductResponse: CreateProduct | null =
      initialCreateProductState.value;

    if (context.params && context.params.id) {
      const resp = await GetProductOperation({
        id: context.params.id as string,
      });

      if (!resp.error) {
        getProductResponse = resp;
        store.dispatch(
          setEditProductState({
            ...resp,
            price: resp.minPrice,

            images: resp.images,
            categories:
              resp.categories.length === 0
                ? [{ id: 0, name: "uncategorized" }]
                : resp.categories,
            discountMultiplier: ((1 - resp.discountMultiplier) * 100).toFixed(
              0
            ),
            variations: (resp.variations as Variation[]).map((variation) => {
              return {
                ...variation,
                discountMultiplier: (
                  ((1 - parseFloat(variation.discountMultiplier)) as number) *
                  100
                )
                  .toFixed(0)
                  .toString(),
              };
            }),
          } as CreateProduct)
        );
      } else {
        getProductResponse = null;
      }
    }

    if (response.error) {
      return {
        props: {
          categories: [{ name: "error while fetching" }],
          errorCode: response.error,
          images: imagesResponse,
          product: getProductResponse,
        },
      };
    }

    return {
      props: {
        categories: response,
        errorCode: "",
        images: imagesResponse,
        product: getProductResponse,
      },
    };
  }
);

export default CreateProduct;
