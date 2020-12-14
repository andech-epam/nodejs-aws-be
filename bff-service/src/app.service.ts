import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method, AxiosResponse } from 'axios';
import { CacheService } from './cache.service';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  async getResponse(
    recipientURL: string,
    originalUrl: string,
    method: string,
    body: unknown,
  ): Promise<unknown> {
    const needCacheRequest =
      originalUrl
        .split('/')
        .filter((path: string) => !!path && path === 'products').length === 1 &&
      method === 'GET';
    const useCache = needCacheRequest && !!this.cacheService.cache;

    console.log('Use cache: ', useCache);
    if (useCache) {
      return this.cacheService.cache;
    }

    const requestConfig: AxiosRequestConfig = {
      method: method as Method,
      url: `${recipientURL}${originalUrl}`,
      ...(Object.entries(body || {}).length > 0 ? { data: body } : {}),
    };

    const { data }: AxiosResponse<any> = await this.httpService
      .request(requestConfig)
      .toPromise();

    console.log('response from recipient: ', data);

    if (needCacheRequest) {
      this.cacheService.cache = data;
    }

    return data;
  }
}
