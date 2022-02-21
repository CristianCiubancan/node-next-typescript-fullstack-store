const GetNavCategoriesOperation = async () => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/getStoreCategories`,
    {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const data = await response.json();
  return data;
};

export default GetNavCategoriesOperation;
