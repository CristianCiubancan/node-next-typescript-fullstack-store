const RegisterOperation = async (values: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/register`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    }
  );

  const data = await response.json();

  return data;
};

export default RegisterOperation;
