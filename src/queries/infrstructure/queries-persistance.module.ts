import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractQueryRepository } from './reposiories/abstract-query.repository';
import { QueryEntity } from './entities/query.entity';
import { QueryRepository } from './reposiories/query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QueryEntity])],
  providers: [
    {
      provide: AbstractQueryRepository,
      useClass: QueryRepository,
    },
  ],
  exports: [AbstractQueryRepository],
})
export class RelationalQueryPersistenceModule {}
