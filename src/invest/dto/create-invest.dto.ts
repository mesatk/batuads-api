import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestDto {
  @ApiProperty({
    description: 'Yatırım miktarı',
    minimum: 0,
    example: 1000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
