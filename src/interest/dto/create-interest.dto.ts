import { IsNumber, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({ description: 'Minimum miktar', example: 1000.0 })
  @IsDecimal()
  minAmount: number;

  @ApiProperty({ description: 'Maximum miktar', example: 5000.0 })
  @IsDecimal()
  maxAmount: number;

  @ApiProperty({ description: 'Faiz oranı', example: 1.5 })
  @IsNumber()
  rate: number;
}
