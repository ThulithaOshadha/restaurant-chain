import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import fileConfig from './files/config/file.config';
import { DatabaseConfig } from './database/config/database-config.type';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [
      databaseConfig,
      authConfig,
      appConfig,
      fileConfig,
    ],
    envFilePath: ['.env'],
  }),TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
