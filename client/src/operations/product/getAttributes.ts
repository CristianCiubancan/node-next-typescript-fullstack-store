const GetAttributesOperation = async (
  categoryId: null | string | number = null,
  searchField: string | null = null
) => {
  const response: any = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL as string
    }/getAttributes/${categoryId}/${searchField}`,
    {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const data = await response.json();
  return data;
};

export default GetAttributesOperation;
