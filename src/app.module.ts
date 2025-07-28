import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BusinessModule } from './business/business.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './models/user.model';
import { Consumer } from './models/consumer.model';
import { CustomField } from './models/custom-field.model';
import { ConsumerCustomFieldValue } from './models/consumer-custom-field-value.model';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumersModule } from './consumers/consumers.module';
import { UsersModule } from './users/users.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
// import { ConsumerCustomFieldValuesModule } from './consumer-custom-field-values/consumer-custom-field-values.module';

import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [User, Consumer, CustomField, ConsumerCustomFieldValue],
        autoLoadModels: true,
        synchronize: true,
      }),
      
    }),
    
    BusinessModule,
    SequelizeModule.forFeature([User, Consumer, CustomField, ConsumerCustomFieldValue]),
    ConsumersModule,
    UsersModule,
    CustomFieldsModule,
    // ConsumerCustomFieldValuesModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
