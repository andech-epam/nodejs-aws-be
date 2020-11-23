import { S3Event, S3EventRecord, S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { BUCKET } from '../consts/bucket';

export const importFileParser: S3Handler = ({ Records }: S3Event) => {
  try {
    const s3 = new S3({ region: 'eu-west-1' });

    Records.forEach((record: S3EventRecord) => {
      const { key } = record.s3.object;

      s3.getObject({
        Bucket: BUCKET,
        Key: key,
      })
        .createReadStream()
        .pipe(csv())
        .on('data', (data: unknown) => {
          console.log(data);
        })
        .on('end', () => onParseEnd(key, s3));
    });
  } catch (e) {
    console.log(e);
  }
};

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
