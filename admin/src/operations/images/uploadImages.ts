const UploadImagesOperation = async (values: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/uploadImages`,
    {
      method: "post",
      // headers: { "Content-Type": "multipart/form-data" },
      credentials: "include",
      body: values,
    }
  );

  const data = await response.json();

  return data;
};

export default UploadImagesOperation;
