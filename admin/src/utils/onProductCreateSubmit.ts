import CreateProductOperation from "../operations/product/createProduct";
import LogoutOperation from "../operations/user/logout";
import {
  CreateProduct,
  initialCreateProductState,
  resetCreateProductState,
  setCreateProductSku,
} from "../redux/features/products/createProduct";
import { Img, Variation } from "../types/product";
import { findDuplicates } from "./findDuplicate";
import { v4 } from "uuid";
import {
  UseFormClearErrors,
  UseFormReset,
  UseFormSetError,
  UseFormTrigger,
} from "react-hook-form";
import { ProductFormFields } from "../pages/create-product";
import { AppDispatch } from "../redux/store";
import { Dispatch, SetStateAction } from "react";
import { setEditProductState } from "../redux/features/products/editProduct";
import EditProductOperation from "../operations/product/editProduct";

export const onProductCreateOrSubmitSubmit = async (
  createProductStateLive: CreateProduct,
  clearErrors: UseFormClearErrors<ProductFormFields>,
  setError: UseFormSetError<ProductFormFields>,
  trigger: UseFormTrigger<ProductFormFields>,
  productImages: Img[],
  setProductImages: Dispatch<SetStateAction<Img[]>>,
  reset: UseFormReset<ProductFormFields>,
  toast: any,
  dispatch: AppDispatch,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
  task: string
) => {
  setSubmitting(true);

  const attributes = createProductStateLive.attributes;

  let duplicateValues: any[] = [];

  attributes
    .map((attr) => attr.values.map((value) => value.name))
    .map((valuesArray) => {
      if (findDuplicates(valuesArray)) {
        duplicateValues.push(true);
      }
    });

  clearErrors();
  const valid = await trigger();
  if (valid) {
    if (
      createProductStateLive.attributes.length > 0 &&
      createProductStateLive.variations.length === 0
    ) {
      setError("variations", {
        type: "custom",
        message:
          "You have attributes but no variations, please make sure to generate variations while having attributes.",
      });
    } else if (findDuplicates(attributes.map((attr) => attr.name))) {
      setError("attributes", {
        type: "custom",
        message: "Different attributes cannot have the same name",
      });
    } else if (duplicateValues.length > 0) {
      setError("attributes", {
        type: "custom",
        message:
          "Different values of the same attribute cannot have the same name",
      });
    } else if (productImages.length === 0) {
      setError("variations", {
        type: "custom",
        message: "A product cannot have no images to display",
      });
    } else {
      let requestObject: CreateProduct = createProductStateLive.isOnSale
        ? {
            ...createProductStateLive,
            stock: "",
            categories:
              createProductStateLive.categories[0].id === 0
                ? []
                : createProductStateLive.categories,
          }
        : {
            ...createProductStateLive,
            stock: "",
            categories:
              createProductStateLive.categories[0].id === 0
                ? []
                : createProductStateLive.categories,
            discountMultiplier: "",
            variations: createProductStateLive.variations.map((variation) => {
              return {
                ...variation,
                discountMultiplier: "",
              };
            }),
          };

      if (task === "create") {
        const resp = await CreateProductOperation(requestObject);
        if (resp.error) {
          if (resp.error === "Your session expired, please relog") {
            await LogoutOperation();
            window.location.href = "/login";
          } else {
            setError("images", {
              type: "custom",
              message: resp.error,
            });
          }
        }

        dispatch(resetCreateProductState());
        reset(initialCreateProductState.value);
        setProductImages([]);
        const productSku = v4();
        dispatch(setCreateProductSku(productSku));
        toast({
          title: "Product created.",
          description: `Product ${requestObject.name} was successfully created.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else if (task === "edit") {
        const resp = await EditProductOperation(requestObject);
        if (resp.error) {
          if (resp.error === "Your session expired, please relog") {
            await LogoutOperation();
            window.location.href = "/login";
          } else {
            setError("images", {
              type: "custom",
              message: resp.error,
            });
          }
        }

        dispatch(
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

        toast({
          title: "Product edited.",
          description: `Product ${requestObject.name} successfuly edited.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  }
  setSubmitting(false);
};
