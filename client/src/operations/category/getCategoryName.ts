const GetCategoryNameOperation = async (id: number) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getCategoryName`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  );

  const data = await response.json();

  return data;
};

export default GetCategoryNameOperation;
