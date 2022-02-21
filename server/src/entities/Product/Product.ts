import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { CategoryProduct } from "../Category/CategoryProduct";
import { Attribute } from "./Attribute";
import { ProductImage } from "./ProductImage";
import { Specification } from "./Specification";
import { Variation } from "./Variation";

@Entity()
@Index(["name", "sku"], { unique: true })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  description: string;

  @Column({ default: false })
  isOnSale: boolean;

  @Column({ type: "decimal" })
  minPrice: number;

  @Column({ type: "decimal" })
  maxPrice: number;

  @Column({ default: 1 })
  stock: number;

  @Column({ type: "decimal", default: 1 })
  discountMultiplier: number;

  @OneToMany(() => Attribute, (attribute) => attribute.product, {
    onDelete: "CASCADE",
  })
  attributes: Attribute[];

  @OneToMany(() => Specification, (specification) => specification.product, {
    onDelete: "CASCADE",
  })
  specifications: Specification[];

  @OneToMany(() => Variation, (variation) => variation.product, {
    onDelete: "CASCADE",
  })
  variations: Variation[];

  @OneToMany(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.product,
    { onDelete: "CASCADE" }
  )
  categoryProduct: CategoryProduct[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    onDelete: "CASCADE",
  })
  productImage: ProductImage[];
}
