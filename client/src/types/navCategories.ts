export interface SubCategory {
  id: number;
  name: string;
  hierarchicalName: string;
  parentCategoryId: number;
  subCategory: SubCategory[];
}

export interface NavCategory {
  id: number;
  name: string;
  hierarchicalName: string;
  parentCategoryId?: any;
  subCategory: SubCategory[];
}
