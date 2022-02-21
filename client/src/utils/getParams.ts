import { FilterAttribute } from "../components/StoreUtilityBar";

export const getParams = (data: any) => {
  const paramsOtherThanAttributesNames: string[] = [
    "sort",
    "searchField",
    "searchBy",
    "categoryId",
    "fbclid",
  ];

  const params: any = {};
  const attributesArray: FilterAttribute[] = [];

  Object.keys(data).forEach((key) => {
    if (paramsOtherThanAttributesNames.includes(key)) {
      params[`${key}`] = data[key];
    } else {
      attributesArray.push({
        name: key,
        values: (typeof data[key] === "string"
          ? [data[key]]
          : data[key]) as string[],
      });
    }
  });

  params.attributes = attributesArray;
  return params;
};
