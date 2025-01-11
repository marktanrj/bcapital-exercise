import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheProvider } from './redis-cache.provider';
import { CacheProvider } from './cache.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CacheProvider,
      useClass: RedisCacheProvider,
    },
  ],
  exports: [CacheProvider],
})
export class CacheModule {}