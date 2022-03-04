import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link,
  SkeletonText,
  Text,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GetCategoryParentsOperation from "../operations/category/getCategoryParents";

export interface Breadcrumb {
  name: string;
  link: string;
}

interface BreadCrumbsComponentProps {}

const BreadCrumbsComponent: React.FC<BreadCrumbsComponentProps> = ({}) => {
  const router = useRouter();

  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [breadcrumbsLoading, setBreadcrumbsLoading] = useState<boolean>(false);

  const categoryTreeToBreadcrumbs = (data: any) => {
    const breadcrumbs: any[] = [];

    const getBreadcrumbs = (data: any) => {
      breadcrumbs.unshift({
        name: data.name,
        link: `/store?categoryId=${data.id}`,
      });

      if (data.parentCategory) {
        getBreadcrumbs(data.parentCategory);
      }
    };

    getBreadcrumbs(data);

    return breadcrumbs;
  };

  const toast = useToast();

  const getCategoryParents = async (categoryId: any) => {
    setBreadcrumbsLoading(true);
    const parents = await GetCategoryParentsOperation(categoryId);

    if (parents.error) {
      toast({
        title: "Error",
        description: parents.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const breadcrumbs = categoryTreeToBreadcrumbs(parents);

      breadcrumbs.unshift({ name: "Store", link: "/store" });

      setBreadcrumbs(breadcrumbs);
      setBreadcrumbsLoading(false);
    }
  };

  useEffect(() => {
    if (router.query?.categoryId) {
      getCategoryParents(router.query?.categoryId);
    } else {
      setBreadcrumbs([{ name: "Store", link: "/store" }]);
    }
  }, [router.query]);

  return (
    <Box>
      {breadcrumbsLoading && !breadcrumbs.length ? (
        <SkeletonText my={3} noOfLines={1}></SkeletonText>
      ) : null}

      {breadcrumbs.length ? (
        <Breadcrumb
          w={"100%"}
          pb={2}
          fontSize={16}
          fontWeight={"semibold"}
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}>
          {breadcrumbs.map((bc, idx) => {
            if (idx === breadcrumbs.length - 1) {
              return (
                <BreadcrumbItem key={bc.name} isCurrentPage>
                  <BreadcrumbLink
                    style={{ textDecoration: "none" }}
                    cursor={"default"}
                    fontWeight={"normal"}
                    as={Text}>
                    {bc.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              );
            } else {
              return (
                <BreadcrumbItem key={bc.name}>
                  <NextLink href={bc.link}>
                    <BreadcrumbLink as={Link} href={bc.link}>
                      {bc.name}
                    </BreadcrumbLink>
                  </NextLink>
                </BreadcrumbItem>
              );
            }
          })}
        </Breadcrumb>
      ) : null}
    </Box>
  );
};

export default BreadCrumbsComponent;
