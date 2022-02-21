interface DeleteProductOperationProps {
  id: number;
}

const DeleteProductOperation = async (props: DeleteProductOperationProps) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/deleteProduct`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(props),
    }
  );

  const data = await response.json();
  return data;
};

export default DeleteProductOperation;
