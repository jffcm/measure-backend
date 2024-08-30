import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Measure extends BaseEntity {
  @PrimaryColumn({ name: 'measure_uuid' })
  measure_uuid: string;

  @Column({ name: 'customer_code' })
  customer_code: string;

  @Column({ name: 'measure_datetime', type: 'datetime' })
  measure_datetime: Date;

  @Column({ name: 'measure_type', type: 'text' })
  measure_type: 'WATER' | 'GAS';

  @Column({ name: 'measure_value', type: 'int', nullable: true })
  measure_value: number;

  @Column({ name: 'image_url' })
  image_url: string;

  @Column({ name: 'has_confirmed', type: 'boolean', default: false })
  has_confirmed: boolean;
}
