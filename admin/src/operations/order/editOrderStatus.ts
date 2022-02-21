import { UpdateOrderStatusData } from "../../pages";

const EditOrderStatusOperation = async (opData: UpdateOrderStatusData) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/editOrderStatus`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(opData),
    }
  );

  const data = await response.json();
  return data;
};

export default EditOrderStatusOperation;
