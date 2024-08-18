import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { SeedModule } from './seed.module';
import { PermissionSeedService } from './permission/permission-seed.service';
import { RolePermissionSeedService } from './role-permission/role-permission-seed.service';
import { CitySeedService } from './city/city-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(PermissionSeedService).run();
  await app.get(RolePermissionSeedService).run();
  await app.get(CitySeedService).run();


  await app.close();
};

void runSeed();
