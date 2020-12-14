import {
  All,
  BadGatewayException,
  Controller,
  HttpException,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  async handleRequests(
    @Req() { originalUrl, method, body }: Request,
  ): Promise<unknown> {
    console.log('originalUrl: ', originalUrl);
    console.log('method: ', method);
    console.log('body: ', body);

    const recipient = originalUrl.split('/')[1];
    console.log('recepient: ', recipient);

    const recipientURL = process.env[recipient];
    console.log('recepientURL: ', recipientURL);

    if (recipientURL) {
      try {
        const response = await this.appService.getResponse(
          recipientURL,
          originalUrl,
          method,
          body,
        );

        return response;
      } catch (error) {
        console.log('recipient error: ', JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;

          throw new HttpException(data, status);
        } else {
          throw new InternalServerErrorException(error.message);
        }
      }
    } else {
      throw new BadGatewayException('Cannot process request');
    }
  }
}
