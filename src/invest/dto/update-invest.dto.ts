import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { InvestStatus } from '../../entities/invest.entity';

export class UpdateInvestDto {
  @ApiProperty({
    description: 'Yatırım durumu',
    enum: InvestStatus,
    example: InvestStatus.APPROVED,
  })
  @IsEnum(InvestStatus)
  status: InvestStatus;
}
