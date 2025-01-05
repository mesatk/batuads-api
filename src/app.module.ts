import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Invest } from './entities/invest.entity';
import { Interest } from './entities/interest.entity';
import { InterestModule } from './interest/interest.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '3728',
      database: process.env.DB_DATABASE || 'batuads',
      entities: [User, Transaction, Invest, Interest],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    InterestModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
