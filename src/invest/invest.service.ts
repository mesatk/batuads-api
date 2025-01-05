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
}
