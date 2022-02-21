export interface CreateCategoryFormFields {
  parentCategoryId?: string;
  name: string;
  parentCategory?: {
    id: number;
    name: string;
    hierarchicalName: string;
    parentCategoryId: number;
  };
}

const CreateCategoryOperation = async (
  categoryData: CreateCategoryFormFields
) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/createCategory`,
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

export default CreateCategoryOperation;
