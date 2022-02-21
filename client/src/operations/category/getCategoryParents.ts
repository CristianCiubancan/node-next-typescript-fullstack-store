const GetCategoryParentsOperation = async (
  categoryId: number | null = null
) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}${
      categoryId
        ? `/getStoreCategoryParents/${categoryId}`
        : `/getStoreCategoryParents`
    }`,
    {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const data = await response.json();
  return data;
};

export default GetCategoryParentsOperation;
