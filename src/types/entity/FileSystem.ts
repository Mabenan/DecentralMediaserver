import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  description: string;
  @Column()
  type: string;
  @Column()
  host: string;
  @Column()
  user: string;
  @Column()
  pass: string;
}
