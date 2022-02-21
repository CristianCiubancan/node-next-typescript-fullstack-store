interface GetProductOperationProps {
  id: string;
}

const GetProductOperation = async (reqObject: GetProductOperationProps) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getProduct`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reqObject),
    }
  );

  const data = await response.json();
  return data;
};

export default GetProductOperation;
