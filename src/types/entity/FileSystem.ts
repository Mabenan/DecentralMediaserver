import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { File } from "./File";
import { PathMap } from "./PathMap";

@Entity()
export class FileSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  ftpHost: string;
  @Column({ nullable: true })
  ftpUser: string;
  @Column({ nullable: true })
  ftpPass: string;

  @Column({ nullable: true })
  webHost: string;

  @OneToMany(type => File, file => file.fileSystem)
  files: File[];

  @OneToMany(type => PathMap, pathMap => pathMap.fileSystem)
  public pathMaps: PathMap[];
}
