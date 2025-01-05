import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDatabase } from './database-init';

async function bootstrap() {
  try {
    // Önce veritabanını oluşturmayı dene
    await createDatabase();

    // Sonra uygulamayı başlat
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log('Uygulama 3000 portunda başlatıldı');
  } catch (error) {
    console.error('Uygulama başlatılırken hata:', error);
    process.exit(1);
  }
}

bootstrap();
