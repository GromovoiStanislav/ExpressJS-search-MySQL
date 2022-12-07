import { DataSource } from 'typeorm';
import { Product } from '../src/entity/product';
import { faker } from '@faker-js/faker';

const connectDB = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'node_search',
  entities: ['src/entity/*.ts'],
  synchronize: true,
});

connectDB.initialize().then(async (connection) => {
  const productRepository = connection.getRepository(Product);

  for (let i = 0; i < 50; i++) {
    await productRepository.save({
      title: faker.lorem.words(2),
      description: faker.lorem.words(10),
      image: faker.image.imageUrl(),
      price: faker.datatype.number(100),
    });
  }

  process.exit();
});
