import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invest, InvestStatus } from '../entities/invest.entity';
import { CreateInvestDto } from './dto/create-invest.dto';
import { Interest } from '../entities/interest.entity';
import { UpdateInvestDto } from './dto/update-invest.dto';

@Injectable()
export class InvestService {
  constructor(
    @InjectRepository(Invest)
    private investRepository: Repository<Invest>,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}

  async create(createInvestDto: CreateInvestDto, userId: number) {
    // En uygun interest'i bul
    const interests = await this.interestRepository.find({
      order: {
        maxAmount: 'DESC',
      },
    });

    let selectedInterest: Interest = interests[0]; // En yüksek maxAmount'a sahip interest

    // Amount değerine uygun interest'i bul
    for (const interest of interests) {
      if (
        createInvestDto.amount >= interest.minAmount &&
        createInvestDto.amount <= interest.maxAmount
      ) {
        selectedInterest = interest;
        break;
      }
    }

    const invest = this.investRepository.create({
      amount: createInvestDto.amount,
      userId: userId,
      interestId: selectedInterest.id,
      status: InvestStatus.PENDING,
    });

    return this.investRepository.save(invest);
  }

  findAll() {
    return this.investRepository.find({
      relations: ['user', 'interest'],
    });
  }

  findOne(id: number) {
    return this.investRepository.findOne({
      where: { id },
      relations: ['user', 'interest'],
    });
  }

  findByUserId(userId: number) {
    return this.investRepository.find({
      where: { userId },
      relations: ['interest'],
    });
  }

  async update(id: number, updateInvestDto: UpdateInvestDto) {
    const invest = await this.investRepository.findOne({
      where: { id },
    });

    if (!invest) {
      throw new NotFoundException('Yatırım bulunamadı');
    }

    invest.status = updateInvestDto.status;
    return this.investRepository.save(invest);
  }

  findPendingInvests() {
    return this.investRepository.find({
      where: { status: InvestStatus.PENDING },
      relations: ['user', 'interest'],
    });
  }

  async calculateReturns(userId: number) {
    const approvedInvests = await this.investRepository.find({
      where: {
        userId,
        status: InvestStatus.APPROVED,
      },
      relations: ['interest'],
    });

    const returns = approvedInvests.map((invest) => {
      const startDate = invest.createdAt;
      const currentDate = new Date();

      // Ay farkını hesapla
      const months =
        (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
        (currentDate.getMonth() - startDate.getMonth()) +
        (currentDate.getDate() >= startDate.getDate() ? 0 : -1);

      // Günlük faiz oranını hesapla (aylık faiz / 30)
      const dailyRate = invest.interest.rate / 100 / 30;

      // Geçen gün sayısını hesapla
      const days = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Toplam getiriyi hesapla
      const totalReturn = invest.amount * dailyRate * days;
      console.log(totalReturn);
      return {
        investId: invest.id,
        originalAmount: invest.amount,
        currentReturn: totalReturn,
        totalAmount: Number(invest.amount) + totalReturn,
        dailyRate,
        daysElapsed: days,
        monthlyRate: invest.interest.rate,
      };
    });

    return {
      userId,
      investments: returns,
      totalReturn: returns.reduce((sum, item) => sum + item.currentReturn, 0),
      totalInvestment: returns.reduce(
        (sum, item) => sum + Number(item.originalAmount),
        0,
      ),
    };
  }
}
