import { Client } from 'pg';
import { DB_CONNECTION_CONFIG } from '../consts/dbConnectionConfig';
import { ProductDto } from '../models/product-dto';

async function getProducts(): Promise<ProductDto[]> {
  const client: Client = new Client(DB_CONNECTION_CONFIG);

  try {
    await client.connect();

    const { rows } = await client.query(`
      select p.id, p.title, p.description, p.price, p.image, s.count
      from products p join stocks s on p.id = s.product_id;
    `);

    return rows;
  } finally {
    client.end();
  }
}

async function getProduct(id: string): Promise<ProductDto | undefined> {
  const client: Client = new Client(DB_CONNECTION_CONFIG);

  try {
    await client.connect();

    const { rows } = await client.query(
      `
      select p.id, p.title, p.description, p.price, p.image, s.count
      from products p join stocks s on p.id = s.product_id
      where p.id = $1;
    `,
      [id]
    );

    return rows[0];
  } finally {
    client.end();
  }
}

async function createProduct({
  title,
  description,
  price,
  image,
  count,
}: ProductDto): Promise<void> {
  const client: Client = new Client(DB_CONNECTION_CONFIG);

  try {
    await client.connect();
    await client.query('begin');

    const { rows } = await client.query(
      `
      insert into products(title, description, price, image) values
      ($1, $2, $3, $4) returning *;
    `,
      [title, description, price, image]
    );

    await client.query(
      `
      insert into stocks(product_id, count) values
      ($1, $2);
    `,
      [rows[0].id, count]
    );

    await client.query('commit');
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.end();
  }
}

export default { getProducts, getProduct, createProduct };
