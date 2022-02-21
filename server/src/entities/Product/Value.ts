import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
} from "typeorm";
import { Attribute } from "./Attribute";
import { VariationAttributeValue } from "./VariationAttributeValue";

@Entity()
export class Value extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  attributeId: number;

  @ManyToOne(() => Attribute, (attr) => attr.values, { onDelete: "CASCADE" })
  @JoinColumn({ name: "attributeId" })
  attribute: Attribute;

  @OneToMany(
    () => VariationAttributeValue,
    (variationAttributeValue) => variationAttributeValue.value,
    { onDelete: "CASCADE" }
  )
  variationAttributeValue: VariationAttributeValue[];
}
