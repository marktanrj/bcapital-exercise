import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

export abstract class CacheProvider implements OnModuleInit, OnModuleDestroy {
  protected client: Redis;
  
  abstract onModuleInit(): Promise<void>;
  abstract onModuleDestroy(): Promise<void>;
  
  getClient(): Redis {
    return this.client;
  }
}