import { S3Event, S3EventRecord, S3Handler } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';
import stripBomStream from 'strip-bom-stream';
import { BUCKET } from '../consts/bucket';
import { ProductDto } from '../models/product-dto';
import * as parseService from '../services/parseService';

export const importFileParser: S3Handler = ({ Records }: S3Event) => {
  try {
    const s3 = new S3({ region: 'eu-west-1' });
    const sqs = new SQS();

    Records.forEach((record: S3EventRecord) => {
      const { key } = record.s3.object;

      s3.getObject({
        Bucket: BUCKET,
        Key: key,
      })
        .createReadStream()
        .pipe(stripBomStream())
        .pipe(csv())
        .on('data', (product: ProductDto) =>
          parseService.onParseRow(product, sqs)
        )
        .on('end', () => parseService.onParseEnd(key, s3));
    });
  } catch (e) {
    console.log(e);
  }
};
