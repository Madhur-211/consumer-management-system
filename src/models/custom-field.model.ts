import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { User } from './user.model';
import { ConsumerCustomFieldValue } from './consumer-custom-field-value.model';
// import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'custom_fields',
  schema: '',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class CustomField extends Model<CustomField> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column
  declare name: string;

  @Column
  declare field_type: string;

  @Column
  declare is_required: boolean;

  @Column({ defaultValue: true })
  declare is_active: boolean;

  @Column({ allowNull: true })
  declare default_value: string;

  @Column({ allowNull: true })
  declare description: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare dropdown: any;

  @Column({ type: DataType.UUID })
  declare created_by: string;

  @Column({ type: DataType.UUID })
  declare updated_by: string;

  @BelongsTo(() => User, 'created_by')
  creator: User;

  @BelongsTo(() => User, 'updated_by')
  updater: User;

  @HasMany(() => ConsumerCustomFieldValue)
  fieldValues: ConsumerCustomFieldValue[];
}
