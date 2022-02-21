export const getErrorMessage = (firstError: any) => {
  if (firstError) {
    if (firstError[0]?.name) return firstError[0].name.message;
    else if (firstError.length && firstError.length > 0) {
      if (firstError.filter((error: any) => error !== null)[0].values) {
        return firstError
          .filter((error: any) => error !== null)[0]
          .values.filter((val: any) => val !== 0)[0].name.message;
      }
      if (firstError.filter((error: any) => error !== null)[0].name) {
        return firstError.filter((error: any) => error !== null)[0].name
          .message;
      }
      if (firstError.filter((error: any) => error !== null)[0].price) {
        return firstError.filter((error: any) => error !== null)[0].price
          .message;
      }
      if (firstError.filter((error: any) => error !== null)[0].stock) {
        return firstError.filter((error: any) => error !== null)[0].stock
          .message;
      }
    } else if (firstError[0]?.values[0]) return firstError[0].values[0].message;
    else return firstError.message;
  } else {
    return null;
  }
};
