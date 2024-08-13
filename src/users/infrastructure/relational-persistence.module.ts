import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserAbstractRepository } from './repositories/user.abstract.repository';
import { UserRepository } from './repositories/user.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    {
      provide: UserAbstractRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UserAbstractRepository],
})
export class RelationalUserPersistenceModule {}
