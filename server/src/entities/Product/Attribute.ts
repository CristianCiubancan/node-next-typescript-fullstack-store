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
import { Value } from "./Value";
import { VariationAttributeValue } from "./VariationAttributeValue";

@Entity()
export class Attribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @OneToMany(() => Value, (val) => val.attribute, { onDelete: "CASCADE" })
  values: Value[];

  @OneToMany(
    () => VariationAttributeValue,
    (variationAttributeValue) => variationAttributeValue.attribute,
    { onDelete: "CASCADE" }
  )
  variationAttributeValue: VariationAttributeValue[];
}
