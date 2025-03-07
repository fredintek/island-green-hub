import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  databaseName: process.env.MYSQL_DATABASE,
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoloadEntities:
    process.env.DATABASE_AUTOLOAD_ENTITIES === 'true' ? true : false,
}));
