import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Product } from "../Product/Product";
import { Category } from "./Category";

@Entity()
export class CategoryProduct extends BaseEntity {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Category, (category) => category.categoryProduct, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => Product, (product) => product.categoryProduct, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;
}
