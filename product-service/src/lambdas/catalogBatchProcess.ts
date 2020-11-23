import { SQSEvent, SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { ProductDto } from '../models/product-dto';
import productsService from '../services/productsService';
import { productValidationSchema } from '../validationSchemas/product';

export const catalogBatchProcess: SQSHandler = async ({
  Records,
}: SQSEvent) => {
  const createdProducts: ProductDto[] = [];

  for (const { body } of Records) {
    let product: ProductDto;

    try {
      console.log(`Trying to parse body ${body}`);

      const parsedBody = JSON.parse(body);
      product = {
        ...parsedBody,
        count: parseInt(parsedBody.count),
        price: parseInt(parsedBody.price),
      };

      console.log('Body successfully parsed');
    } catch (e) {
      console.log(`Error during parsing ${body}`);
      console.log(e);
      continue;
    }

    try {
      console.log('Validating product:');
      console.table(product);

      await productValidationSchema.validateAsync(product);

      console.log('Product successfully validated');
    } catch (e) {
      console.log('Invalid product');
      console.log(e);
      continue;
    }

    try {
      console.log('Trying to create product:');
      console.table(product);

      await productsService.createProduct(product);
      createdProducts.push(product);

      console.log('Product successfully created');
    } catch (e) {
      console.log('Error during creation product');
      console.log(e);
      continue;
    }
  }

  const sns = new SNS({ region: 'eu-west-1' });

  try {
    await sns
      .publish({
        Subject: 'New products were created.',
        Message: JSON.stringify(createdProducts),
        TopicArn: process.env.SNS_ARN,
      })
      .promise();

    console.log('Email successfully sended');
    console.table(createdProducts);
  } catch (e) {
    console.log('Error happened during sending email:');
    console.log(e);
  }
};
