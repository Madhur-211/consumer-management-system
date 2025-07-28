import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  HasMany
} from 'sequelize-typescript';
import { User } from './user.model';
import { ConsumerCustomFieldValue } from './consumer-custom-field-value.model';
import { BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'consumers',
  schema: '',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Consumer extends Model<Consumer> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare consumer_id: string;

  @Column
  declare first_name: string;

  @Column
  declare last_name: string;

  @Column({ unique: true })
  declare email: string;

  @Column({ unique: true })
  declare phone: string;

  @Column(DataType.TEXT)
  declare address: string;

  @Column(DataType.DATE)
  declare date_of_birth: Date;

  @Column(DataType.STRING(10))
  declare gender: string;

  @Column({ type: DataType.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' })
  declare status: string;

  @Column({ defaultValue: false })
  declare is_blocked: boolean;

  @Column({ defaultValue: false })
  declare is_test_consumer: boolean;

  // @Column(DataType.DATE)
  // declare deleted_at: Date;

  @Column({ type: DataType.UUID })
  declare created_by: string;

  // @Column(DataType.DATE)
  // declare created_at: Date;

  // @Column(DataType.DATE)
  // declare updated_at: Date;

  @Column({ type: DataType.UUID })
  declare updated_by: string;

  @BelongsTo(() => User, 'created_by')
  creator: User;

  @BelongsTo(() => User, 'updated_by')
  updater: User;

  @HasMany(() => ConsumerCustomFieldValue)
  customFieldValues: ConsumerCustomFieldValue[];
}
