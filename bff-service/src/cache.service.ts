import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private CACHE_TIME_SPAN = 120000; // 2 minutes

  private expireAt = 0;
  private _cache: unknown[];

  public set cache(value: unknown[]) {
    this._cache = value;
    this.expireAt = Date.now() + this.CACHE_TIME_SPAN;
  }

  public get cache(): unknown[] | null {
    if (this.expireAt > Date.now()) {
      return this._cache;
    }
  }
}
