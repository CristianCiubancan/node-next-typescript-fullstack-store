import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import GetAllCategoriesOperation from "../../operations/category/getAllCategories";
import GetProductsOperation from "../../operations/product/getProducts";
import { Product } from "../../types/product";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { products } = await GetProductsOperation({
    searchBy: "name",
    categoryId: null,
    sort: "name:ASC",
    searchField: "",
    cursor: null,
    attributes: null,
  });

  const categories = await GetAllCategoriesOperation();

  const productFields: ISitemapField[] = products.map((product: Product) => ({
    loc: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/product?productId=${product.sku}`,
    lastmod: new Date().toISOString(),
  }));

  const categoryFields: ISitemapField[] = categories.map(
    (category: Product) => ({
      loc: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store?categoryId=${category.id}`,
      lastmod: new Date().toISOString(),
    })
  );

  return getServerSideSitemap(ctx, [...categoryFields, ...productFields]);
};

export default function Site() {}
