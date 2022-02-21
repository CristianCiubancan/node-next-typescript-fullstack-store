import { GetProductsRequestValues } from "../operations/product/getProducts";
import { SearchParams } from "../pages/store";

export const newSearchParams = (data: SearchParams) => {
  return {
    searchBy: data.searchBy ? data.searchBy : "name",
    categoryId: data.categoryId ? data.categoryId : null,
    sort: data.sort ? data.sort : "name:ASC",
    searchField: data.searchField ? data.searchField : "",
    cursor: null,
    attributes: data.attributes?.length ? data.attributes : null,
  } as GetProductsRequestValues;
};
