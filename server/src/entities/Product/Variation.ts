import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { VariationAttributeValue } from "./VariationAttributeValue";

@Entity()
export class Variation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ type: "decimal", default: "0" })
  price: number;

  @Column()
  stock: number;

  @Column()
  productId: number;

  @Column({ type: "decimal", default: 1 })
  discountMultiplier: number;

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @OneToMany(
    () => VariationAttributeValue,
    (variationAttributeValues) => variationAttributeValues.variation,
    { onDelete: "CASCADE" }
  )
  variationAttributeValues: VariationAttributeValue[];
}
