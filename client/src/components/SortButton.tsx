import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSortAlphaUp } from "react-icons/fa";
import { FilterAttribute } from "./StoreUtilityBar";

interface SortButtonProps {
  attributes: FilterAttribute[];
}

const SortButton: React.FC<SortButtonProps> = ({ attributes }) => {
  const [sort, setSort] = useState<string>("name:ASC");

  const router = useRouter();

  useEffect(() => {
    if (router.query?.sort) {
      setSort(router.query?.sort as string);
    }
  }, [router.query]);

  return (
    <Menu gutter={12}>
      {({ isOpen, onClose }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={IconButton}
            p={0}
            aria-label="Search"
            colorScheme={"purple"}
            color={"white"}
            size="lg"
            icon={<FaSortAlphaUp />}
          />

          <MenuList right={0} p={4}>
            <Select
              id={"orderBy"}
              variant="outline"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}>
              <option value="name:ASC">Name ASC </option>
              <option value="name:DESC">Name DESC</option>
              <option value='"minPrice"*"discountMultiplier":ASC'>
                Price ASC
              </option>
              <option value='"minPrice"*"discountMultiplier":DESC'>
                Price DESC
              </option>
            </Select>

            <Button
              mt={2}
              colorScheme={"purple"}
              w={"100%"}
              onClick={() => {
                const data = router.query;

                const formerParams: any[] = [];
                const attributesParams: any[] = [];

                Object.keys(router.query).forEach((key) => {
                  if (
                    attributes.filter((attr) => attr.name === key).length ===
                      0 &&
                    key !== "sort"
                  ) {
                    formerParams.push(`${key}=${router.query[key]}`);
                  } else if (
                    attributes.filter((attr) => attr.name === key).length > 0
                  ) {
                    if (typeof router.query[key] === "string") {
                      attributesParams.push(`${key}=${router.query[key]}`);
                    } else {
                      (router.query[key] as string[]).forEach((value) => {
                        attributesParams.push(`${key}=${value}`);
                      });
                    }
                  }
                });

                const newParams = [
                  ...formerParams,
                  ...attributesParams,
                  `sort=${sort}`,
                ].join("&");
                router.push(`/store?${newParams}`);
                onClose();
              }}>
              Sort
            </Button>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default SortButton;
