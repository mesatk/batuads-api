import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDatabase } from './database-init';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { User } from './entities/user.entity';

async function createAdminUser(app) {
  try {
    const userRepository = app.get(`${User.name}Repository`);
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!existingAdmin) {
      const adminUser = userRepository.create({
        name: 'admin',
        email: 'admin@admin.com',
        password: '123456',
        role: 'admin',
      });

      await userRepository.save(adminUser);
      console.log('Admin kullanıcısı başarıyla oluşturuldu');
    }
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
  }
}

async function bootstrap() {
  try {
    await createDatabase();

    const app = await NestFactory.create(AppModule);

    // CORS ayarları
    app.enableCors({
      origin: 'http://localhost:4000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('BatuAds API')
      .setDescription('BatuAds API dokümantasyonu')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Admin kullanıcısını oluştur
    await createAdminUser(app);

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
