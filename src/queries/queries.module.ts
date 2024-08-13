import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { RelationalQueryPersistenceModule } from './infrstructure/queries-persistance.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [RelationalQueryPersistenceModule, UsersModule],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService]
})
export class QueriesModule { }
