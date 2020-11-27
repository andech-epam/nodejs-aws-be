import { S3, SQS } from 'aws-sdk';
import { BUCKET } from '../consts/bucket';
import { ProductDto } from '../models/product-dto';

async function onParseRow(product: ProductDto, sqs: SQS): Promise<void> {
  console.log(product);

  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(product),
      })
      .promise();

    console.log('Product sended to SQS:');
    console.table(product);
  } catch (e) {
    console.log('Error happened during sending to SQS:');
    console.log(e);
  }
}

async function onParseEnd(key: string, s3: S3): Promise<void> {
  const copiedKey = key.replace('uploaded', 'parsed');

  console.log('File successfully parsed.');

  await copyFileToParsed(key, copiedKey, s3);
  await removeFileFromUploaded(key, s3);
}

async function copyFileToParsed(
  key: string,
  copiedKey: string,
  s3: S3
): Promise<void> {
  console.log(
    `Trying to copy file ${BUCKET}/${key} into file ${BUCKET}/${copiedKey}`
  );

  await s3
    .copyObject({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${key}`,
      Key: copiedKey,
    })
    .promise();

  console.log(
    `File ${BUCKET}/${key} successfully into file ${BUCKET}/${copiedKey}.`
  );
}

async function removeFileFromUploaded(key: string, s3: S3): Promise<void> {
  console.log(`Trying to remove file ${BUCKET}/${key}`);

  await s3
    .deleteObject({
      Bucket: BUCKET,
      Key: key,
    })
    .promise();

  console.log(`File ${BUCKET}/${key} successfully removed.`);
}

export { onParseRow, onParseEnd, copyFileToParsed, removeFileFromUploaded };
