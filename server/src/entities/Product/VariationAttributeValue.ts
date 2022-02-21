import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Attribute } from "./Attribute";
import { Value } from "./Value";
import { Variation } from "./Variation";

@Entity()
export class VariationAttributeValue extends BaseEntity {
  @PrimaryColumn()
  variationId: number;

  @PrimaryColumn()
  valueId: number;

  @PrimaryColumn()
  attributeId: number;

  @ManyToOne(
    () => Variation,
    (variation) => variation.variationAttributeValues,
    {
      primary: true,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "variationId" })
  variation: Variation;

  @ManyToOne(
    () => Attribute,
    (attribute) => attribute.variationAttributeValue,
    {
      primary: true,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "attributeId" })
  attribute: Attribute;

  @ManyToOne(() => Value, (value) => value.variationAttributeValue, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "valueId" })
  value: Value;
}
