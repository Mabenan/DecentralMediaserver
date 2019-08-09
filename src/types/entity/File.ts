import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Album } from "./Album";
import { FileSystem } from "./FileSystem";

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


  @ManyToOne(type => Album, album => album.files)
  public album: Album;
  @ManyToOne(type => FileSystem, fileSystem => fileSystem.files)
  public fileSystem: FileSystem;
}
