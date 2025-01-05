import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

async function createDatabase() {
  // Önce postgres veritabanına bağlanıyoruz
  const client = new Client({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Veritabanının var olup olmadığını kontrol ediyoruz
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE}'`,
    );

    if (checkDb.rowCount === 0) {
      // Veritabanı yoksa oluşturuyoruz
      await client.query(`CREATE DATABASE ${DB_DATABASE}`);
      console.log(`Veritabanı başarıyla oluşturuldu: ${DB_DATABASE}`);
    } else {
      console.log(`Veritabanı zaten mevcut: ${DB_DATABASE}`);
    }
  } catch (error) {
    console.error('Veritabanı oluşturulurken hata:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Script doğrudan çalıştırıldığında
if (require.main === module) {
  createDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { createDatabase };
