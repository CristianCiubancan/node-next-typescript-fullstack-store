import { CheckOrderRequestObject } from "./checkOrder";

const CompleteOrderOperation = async (reqObj: CheckOrderRequestObject) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/completeOrder`,
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

export default CompleteOrderOperation;
