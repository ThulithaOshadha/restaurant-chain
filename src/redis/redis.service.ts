import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly configService: ConfigService<AllConfigType>,
    ) { }

    private client: RedisClientType;

    async onModuleInit() {
        this.client = createClient({
            url: this.configService.get('app.redisHost', { infer: true }),
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));

        await this.client.connect();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async setex(key: string, seconds: number, value: string): Promise<void> {
        await this.client.setEx(key, seconds, value);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
