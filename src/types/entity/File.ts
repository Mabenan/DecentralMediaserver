import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Album } from "./Album";
import { FileSystem } from "./FileSystem";
import { Day } from "./Day";

@Entity()
export class File {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column({nullable: true})
  public name: string;

  @Column({nullable: true})
  public createdAt: Date;

  @Column({nullable: true})
  public ftpPath: string;

  @Column({nullable: true})
  public webPath: string;
  @Column({type: "blob", nullable: true})
  public thumb: string;

  @Column({default: false})
  public deleted: boolean;


  @ManyToOne(type => Album, album => album.files, {eager: true})
  public album: Album;
  @ManyToOne(type => FileSystem, fileSystem => fileSystem.files, {eager: true})
  public fileSystem: FileSystem;
  @ManyToOne(type => Day, day => day.images, {eager: true})
  public day: Day;

  public toLoad: boolean;
}
