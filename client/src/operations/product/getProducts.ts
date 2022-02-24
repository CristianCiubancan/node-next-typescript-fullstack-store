import { SearchParams } from "../../pages/store";

export interface GetProductsRequestValues extends SearchParams {
  cursor: string | null;
  firstCursor: number | string | null;
  secondCursor: string | null;
}

const GetProductsOperation = async (reqObj: GetProductsRequestValues) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getStoreProducts`,
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
