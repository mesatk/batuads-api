import { IsNumber, IsDecimal, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInterestDto {
  @ApiPropertyOptional({ description: 'Minimum miktar', example: 1000.0 })
  @IsDecimal()
  @IsOptional()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum miktar', example: 5000.0 })
  @IsDecimal()
  @IsOptional()
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Faiz oranı', example: 1.5 })
  @IsNumber()
  @IsOptional()
  rate?: number;
}
