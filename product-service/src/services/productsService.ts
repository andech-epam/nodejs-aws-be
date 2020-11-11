import { Client } from "pg";
import { DB_CONNECTION_CONFIG } from "../consts/dbConnectionConfig";
import { ProductDto } from "../models/product-dto";

export async function getAllProducts(): Promise<ProductDto[]> {
  const client = new Client(DB_CONNECTION_CONFIG);

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

export async function getProduct(id: string): Promise<ProductDto | undefined> {
  const client = new Client(DB_CONNECTION_CONFIG);

  try {
    await client.connect();

    const { rows } = await client.query(`
      select p.id, p.title, p.description, p.price, p.image, s.count
      from products p join stocks s on p.id = s.product_id
      where p.id = '${id}';
    `);

    return rows[0];
  } finally {
    client.end();
  }
}

export async function addNewProduct({
  title,
  description,
  price,
  image,
  count,
}: ProductDto): Promise<void> {
  const client = new Client(DB_CONNECTION_CONFIG);

  try {
    await client.connect();
    await client.query("begin");

    const { rows } = await client.query(`
      insert into products(title, description, price, image) values
      ('${title}', '${description}', ${price}, '${image}') returning *;
    `);

    await client.query(`
      insert into stocks(product_id, count) values
      ('${rows[0].id}', ${count});
    `);

    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.end();
  }
}
