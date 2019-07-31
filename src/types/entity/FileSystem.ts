import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FileSystem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    path: string;

}
