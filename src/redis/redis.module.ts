import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
    providers: [RedisService],
    exports: [RedisService], // Export RedisService to be able to inject it in other modules
})
export class RedisModule { }
