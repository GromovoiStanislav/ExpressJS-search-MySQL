import express from 'express';
import { DataSource } from 'typeorm';
import { Product } from './entity/product';

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

connectDB
  .initialize()
  .then((connection) => {
    const productRepository = connection.getRepository(Product);

    const app = express();

    app.use(express.json());

    app.get('/api/products/frontend', async (req, res) => {
      const products = await productRepository.find();
      res.send(products);
    });

    app.get('/api/products/backend', async (req, res) => {
      const builder = productRepository.createQueryBuilder('products');

      if (req.query.s) {
        builder.where(
          'products.title LIKE :s OR products.description LIKE :s',
          {
            s: `%${req.query.s}%`,
          }
        );
      }

      const sort: any = req.query.sort; //'asc' or 'desc'

      if (sort) {
        builder.orderBy('products.price', sort.toUpperCase());
      }

      const page: number = parseInt(req.query.page as any) || 1;
      const perPage = 9;
      const total = await builder.getCount();
      builder.offset((page - 1) * perPage).limit(perPage);

      res.send({
        data: await builder.getMany(),
        total,
        page,
        last_page: Math.ceil(total / perPage),
      });
    });

    console.log('listening to port 3000');
    app.listen(3000);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });
