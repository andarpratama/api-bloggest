// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as dotenv from 'dotenv';
// dotenv.config();

// const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   url: process.env.DB_URL,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true, // Set to false in production
//   extra: {
//     insecureAuth: true,
//   },
// };

// export default typeOrmConfig;

// typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306, // Change the port if your MySQL server is running on a different port
  username: 'root',
  password: 'root',
  database: 'db-bloggest',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
};

export default typeOrmConfig;

