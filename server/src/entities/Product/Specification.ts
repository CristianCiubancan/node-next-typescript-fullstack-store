import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity()
export class Specification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.specifications, {
    onDelete: "CASCADE",
    primary: false,
  })
  @JoinColumn({ name: "productId" })
  product: Product;
}
