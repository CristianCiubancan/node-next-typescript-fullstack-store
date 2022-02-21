import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Image } from "../Image/Image";
import { Product } from "./Product";

@Entity()
export class ProductImage extends BaseEntity {
  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  imageId: number;

  @ManyToOne(() => Product, (product) => product.productImage, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => Image, (attribute) => attribute.productImage, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "imageId" })
  image: Image;
}
