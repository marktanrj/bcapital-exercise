import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheProvider } from './cache.provider';

@Injectable()
export class RedisCacheProvider extends CacheProvider {
  private readonly logger = new Logger(RedisCacheProvider.name);

  constructor(private readonly configService: ConfigService) {
    super();

    const redisConfig = this.configService.get('cache');

    this.client = new Redis(redisConfig.url, {
      ...(redisConfig.url ? {} : { host: redisConfig.host, port: redisConfig.port }),
      retryStrategy: (times) => Math.min(times * 50, 5000),
    });

    console.log(redisConfig);

    this.client.on('error', (error) => {
      this.logger.error('Redis client error:', error);
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      this.logger.log('Redis connection verified');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }
}