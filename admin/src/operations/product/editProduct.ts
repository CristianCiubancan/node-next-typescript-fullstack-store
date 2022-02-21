import { CreateProduct } from "../../redux/features/products/createProduct";

const EditProductOperation = async (productData: CreateProduct) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/editProduct`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();
  return data;
};

export default EditProductOperation;
