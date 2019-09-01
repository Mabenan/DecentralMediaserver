import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { File } from "./File";

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @OneToMany(type => File, file => file.album)
  public files: File[];
}
