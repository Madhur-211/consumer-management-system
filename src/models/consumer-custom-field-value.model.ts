import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  Default,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Consumer } from './consumer.model';
import { CustomField } from './custom-field.model';
import { User } from './user.model';

@Table({
  tableName: 'consumer_custom_field_values',
  schema: '',
  timestamps: true,
  underscored: true,
})
export class ConsumerCustomFieldValue extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Consumer)
  @Column({ type: DataType.UUID })
  declare consumer_id: string;

  @ForeignKey(() => CustomField)
  @Column({ type: DataType.UUID })
  declare custom_field_id: string;

  @Column(DataType.TEXT)
  declare value: string;

  @Column({ type: DataType.UUID })
  declare created_by: string;

  @Column({ type: DataType.UUID })
  declare updated_by: string;

  @BelongsTo(() => Consumer)
  consumer: Consumer;

  @BelongsTo(() => CustomField)
  customField: CustomField;

  @BelongsTo(() => User, 'created_by')
  creator: User;

  @BelongsTo(() => User, 'updated_by')
  updater: User;
}
