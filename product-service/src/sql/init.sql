create extension if not exists "uuid-ossp";

drop table if exists products cascade;
drop table if exists stocks;

create table products(
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer,
	image text
);

create table stocks(
	id uuid primary key default uuid_generate_v4(),
	product_id uuid unique not null references products(id) on delete cascade,
  count integer
);

insert into products values 
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'Nike Air Zoom Structure 23', 'Short Product Description1', 120, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/7f641312-a2bb-42f2-9729-109d0388d186.webp'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'Nike Air Zoom Pegasus 37', 'Short Product Description3', 110, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/9e339221-121f-424b-b011-2d9bc889718e.webp'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a8', 'Nike Pegasus Trail 2', 'Short Product Description2', 140, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/554844a5-48ff-48f3-ae14-be936430a57b.webp'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'Nike Todos RN', 'Short Product Description7', 60, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/bmdcsdy56pw1hsblooy2.webp'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'Nike Juniper Trail', 'Short Product Description2', 90, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/d3d3ccf5-5a89-4e9e-b7e4-32f1602ce36e.webp'),
('7567ec4b-b10c-48c5-9345-fc73348a80a1', 'Nike Downshifter 10', 'Short Product Description4', 60, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/f0efcf48-4c0a-47e7-b577-afae5d57ea43.webp'),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 'Nike Air Zoom Pegasus 36 Trail', 'Short Product Descriptio1', 80, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/ece6ebd0-a190-4ca9-a123-6835c2fb4a43.webp'),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 'Nike Zoom Fly 3', 'Short Product Description7', 170, 'https://rs-app-images.s3-eu-west-1.amazonaws.com/ffa9b903-60f3-4ff8-bc91-f0622d8e573a.webp');

insert into stocks(product_id, count) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6),
('7567ec4b-b10c-48c5-9345-fc73c48a80a8', 7),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7),
('7567ec4b-b10c-48c5-9345-fc73348a80a1', 8),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 2),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 3);