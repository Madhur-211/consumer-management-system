import { UUIDV4 } from 'sequelize';
import {
  Column,
  DataType,
  Model,
  Table,
  Default,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { Consumer } from './consumer.model';
import { CustomField } from './custom-field.model';
import { ConsumerCustomFieldValue } from './consumer-custom-field-value.model';

@Table({ tableName: 'users',schema: '', timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'schema_name',
  })
  declare schema_name: string;

  @HasMany(() => Consumer, 'created_by')
  createdConsumers: Consumer[];

  @HasMany(() => Consumer, 'updated_by')
  updatedConsumers: Consumer[];

  @HasMany(() => CustomField, 'created_by')
  createdCustomFields: CustomField[];

  @HasMany(() => CustomField, 'updated_by')
  updatedCustomFields: CustomField[];

  @HasMany(() => ConsumerCustomFieldValue, 'created_by')
  customFieldValuesCreated: ConsumerCustomFieldValue[];

  @HasMany(() => ConsumerCustomFieldValue, 'updated_by')
  customFieldValuesUpdated: ConsumerCustomFieldValue[];
}
