import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../entities/interest.entity';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const interest = this.interestRepository.create(createInterestDto);
    return await this.interestRepository.save(interest);
  }

  async findAll(): Promise<Interest[]> {
    return await this.interestRepository.find();
  }

  async findOne(id: number): Promise<Interest> {
    const interest = await this.interestRepository.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException('İlgi alanı bulunamadı');
    }
    return interest;
  }

  async update(
    id: number,
    updateInterestDto: UpdateInterestDto,
  ): Promise<Interest> {
    const interest = await this.findOne(id);
    Object.assign(interest, updateInterestDto);
    return await this.interestRepository.save(interest);
  }

  async remove(id: number): Promise<void> {
    const result = await this.interestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('İlgi alanı bulunamadı');
    }
  }
}
