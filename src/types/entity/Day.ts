import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { File } from './File';

@Entity()
export class Day {

  @PrimaryColumn()
  public day: string;


  @OneToMany(type => File, file => file.day)
  public images: File[];

}
