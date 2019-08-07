import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { File } from "./File";
import { FileSystem } from "./FileSystem";

@Entity()
export class PathMap {
  @PrimaryGeneratedColumn()
  public id: string;

  @ManyToOne(type => FileSystem, fileSystem => fileSystem.pathMaps)
  public fileSystem: FileSystem;

  @Column()
  public ftpPath: string;

  @Column()
  public webPath: string;
}
