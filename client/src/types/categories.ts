export interface Category {
  id: number;
  name: string;
  hierarchicalName: string;
  parentCategoryId?: number;
  depth: number;
}
