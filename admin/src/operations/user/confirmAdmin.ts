const ConfirmAdminOperation = async (token: string) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}/confirmAdmin`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    }
  );

  const data = await response.json();

  return data;
};

export default ConfirmAdminOperation;
