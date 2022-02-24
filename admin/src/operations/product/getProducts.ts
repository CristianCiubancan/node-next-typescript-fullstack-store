import { PaginatedProductsForm } from "../../pages/products";

export interface GetProductsRequestValues extends PaginatedProductsForm {
  cursor: string | null;
  firstCursor: number | string | null;
  secondCursor: string | null;
}

const GetProductsOperation = async (reqObj: GetProductsRequestValues) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getProducts`,
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

export default GetProductsOperation;
