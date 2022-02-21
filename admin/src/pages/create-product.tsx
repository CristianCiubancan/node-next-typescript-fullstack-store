import {
  Accordion,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import AccordionItemContainer from "../components/AccordionComponents/AccordionItemContainer";
import ProductAttributes from "../components/CreateProductComponents/productAttributes";
import ProductCategory from "../components/CreateProductComponents/productCategory";
import ProductGeneralInfo from "../components/CreateProductComponents/productGeneralInfo";
import ProductImages from "../components/CreateProductComponents/productImages";
import ProductSpecifications from "../components/CreateProductComponents/productSpecifications";
import ProductVariations from "../components/CreateProductComponents/productVariations";
import Layout from "../components/Layout";
import GetAllCategoriesOperation from "../operations/category/getAllCategories";
import GetImagesOperation from "../operations/images/getImages";
import {
  CreateProduct,
  setCreateProductSku,
} from "../redux/features/products/createProduct";
import { CurrentUser } from "../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { wrapper } from "../redux/store";
import { Img } from "../types/product";
import { getErrorMessage } from "../utils/getErrorMessage";
import { onProductCreateOrSubmitSubmit } from "../utils/onProductCreateSubmit";

interface CreateProductProps {
  categories: any[];
  currentUser: CurrentUser;
  images: Img[];
  errorCode: string;
}

export interface ProductFormFields extends CreateProduct {
  productCategory: string;
}

const CreateProduct: React.FC<CreateProductProps> = ({
  categories,
  currentUser,
  errorCode,
  images,
}) => {
  const {
    createProduct: { value: createProductStateLive },
  } = useAppSelector((state) => state);

  const [productImages, setProductImages] = useState<Img[]>(
    createProductStateLive.images
  );
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
    if (!createProductStateLive.sku) {
      const productSku = v4();
      dispatch(setCreateProductSku(productSku));
    }
  }, []);

  useEffect(() => {
    reset(createProductStateLive);
  }, [createProductStateLive]);

  const firstError = Object.entries(errors).map(([_k, v]) => v)[0] as any;

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
        <form name="create-product">
          <Accordion allowToggle m={2} defaultIndex={[0]}>
            <AccordionItemContainer
              color={"yellow.500"}
              title={"General information"}>
              <ProductGeneralInfo
                values={createProductStateLive}
                task={"create"}
              />
            </AccordionItemContainer>
            <AccordionItemContainer color={"orange.500"} title={"Category"}>
              <ProductCategory
                categories={categories}
                values={createProductStateLive}
                task={"create"}
              />
            </AccordionItemContainer>
            <AccordionItemContainer color={"green.500"} title={"Images"}>
              <ProductImages
                task={"create"}
                images={images}
                productImages={productImages}
                setProductImages={setProductImages}
                displayImageSelector={displayImageSelector}
                setDisplayImageSelector={setDisplayImageSelector}
              />
            </AccordionItemContainer>
            <AccordionItemContainer color={"blue.500"} title={"Attributes"}>
              <ProductAttributes
                values={createProductStateLive}
                task={"create"}
              />
            </AccordionItemContainer>

            <AccordionItemContainer color={"purple.500"} title={"Variations"}>
              <ProductVariations
                values={createProductStateLive}
                task={"create"}
              />
            </AccordionItemContainer>

            <AccordionItemContainer color={"pink.500"} title={"Specifications"}>
              <ProductSpecifications
                values={createProductStateLive}
                task={"create"}
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
                  createProductStateLive,
                  clearErrors,
                  setError,
                  trigger,
                  productImages,
                  setProductImages,
                  reset,
                  toast,
                  dispatch,
                  setSubmitting,
                  "create"
                );
              }}
              type="button">
              Create product
            </Button>
          </FormControl>
        </form>
      </FormProvider>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const response = await GetAllCategoriesOperation();

    const imagesResponse = await GetImagesOperation();

    if (response.error) {
      return {
        props: {
          categories: [{ name: "error while fetching" }],
          errorCode: response.error,
          images: imagesResponse,
        },
      };
    }

    return {
      props: {
        categories: response,
        images: imagesResponse,
        errorCode: "",
      },
    };
  }
);

export default CreateProduct;
