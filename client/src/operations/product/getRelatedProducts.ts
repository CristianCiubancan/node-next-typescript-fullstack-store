import { SearchParams } from "../../pages/store";

export interface GetRelatedProductsRequestValues {
  categoryId: number | null;
  productId: number;
}

const GetRelatedProductsOperation = async (
  reqObj: GetRelatedProductsRequestValues
) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getRelatedProducts`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reqObj),
    }
  );

  const data = await response.json();

  return data;
};

export default GetRelatedProductsOperation;
