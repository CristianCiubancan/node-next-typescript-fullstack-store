import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { CategoryProduct } from "./CategoryProduct";

@Entity()
@Tree("materialized-path")
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  hierarchicalName: string;

  @Column({ nullable: true })
  parentCategoryId: number | null;

  @TreeChildren()
  subCategory: Category[];

  @TreeParent({ onDelete: "CASCADE" })
  @JoinColumn({ name: "parentCategoryId" })
  parentCategory: Category;

  @OneToMany(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.category,
    { onDelete: "CASCADE" }
  )
  categoryProduct: CategoryProduct[];
}
