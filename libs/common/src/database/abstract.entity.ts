import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @Column('uuid')
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
