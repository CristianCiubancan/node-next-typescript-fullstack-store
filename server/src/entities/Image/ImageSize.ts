import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Image } from "./Image";

@Entity()
export class ImageSize extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  width: number;

  @Column()
  url: string;

  @Column()
  parentImageId: string;

  @ManyToOne(() => Image, (image) => image.sizes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parentImageId" })
  parentImage: Image;
}
