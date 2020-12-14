import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
