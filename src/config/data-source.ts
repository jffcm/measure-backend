import 'reflect-metadata'
import { DataSource } from 'typeorm';
import { Measure } from '../models/Measure';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `${process.cwd()}/src/database/database.sqlite`,
  migrations: ['src/database/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  entities: [Measure],
  synchronize: true,
  logging: false,
});

async function initialize(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  }
}

initialize();


