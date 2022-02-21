import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductImage } from "../Product/ProductImage";
import { ImageSize } from "./ImageSize";

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  placeholderUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ImageSize, (size) => size.parentImage, {
    onDelete: "CASCADE",
  })
  sizes: ImageSize[];

  @OneToMany(() => ProductImage, (productImage) => productImage.image, {
    onDelete: "CASCADE",
  })
  productImage: ProductImage[];
}
