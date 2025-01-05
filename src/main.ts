import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDatabase } from './database-init';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    // Önce veritabanını oluşturmayı dene
    await createDatabase();

    // Sonra uygulamayı başlat
    const app = await NestFactory.create(AppModule);

    // Swagger konfigürasyonu
    const config = new DocumentBuilder()
      .setTitle('BatuAds API')
      .setDescription('BatuAds API dokümantasyonu')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log('Uygulama 3000 portunda başlatıldı');
    console.log(
      'Swagger dokümantasyonu http://localhost:3000/api adresinde erişilebilir',
    );
  } catch (error) {
    console.error('Uygulama başlatılırken hata:', error);
    process.exit(1);
  }
}

bootstrap();
