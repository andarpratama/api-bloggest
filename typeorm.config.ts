import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  url: process.env.DB_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
  extra: {
    insecureAuth: true,
  },
};

export default typeOrmConfig;
