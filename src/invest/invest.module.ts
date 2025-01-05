import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestService } from './invest.service';
import { InvestController } from './invest.controller';
import { Invest } from '../entities/invest.entity';
import { Interest } from '../entities/interest.entity';
import { InvestGateway } from './invest.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invest, Interest]),
    JwtModule.register({
      secret: 'testKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [InvestController],
  providers: [InvestService, InvestGateway],
})
export class InvestModule {}
