export interface RemoveCategoryFormFields {
  categoryId: number;
}

const RemoveCategoryOperation = async (
  categoryData: RemoveCategoryFormFields
) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/removeCategory`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(categoryData),
    }
  );

  const data = await response.json();
  return data;
};

export default RemoveCategoryOperation;
