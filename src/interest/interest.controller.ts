import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Interest } from '../entities/interest.entity';

@ApiTags('İlgi Alanları')
@ApiBearerAuth()
@Controller('interests')
@UseGuards(AuthGuard)
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni bir ilgi alanı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'İlgi alanı başarıyla oluşturuldu.',
    type: Interest,
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestService.create(createInterestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm ilgi alanlarını listele' })
  @ApiResponse({
    status: 200,
    description: 'İlgi alanları başarıyla listelendi.',
    type: [Interest],
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  findAll() {
    return this.interestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "ID'ye göre ilgi alanı getir" })
  @ApiResponse({
    status: 200,
    description: 'İlgi alanı başarıyla getirildi.',
    type: Interest,
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'İlgi alanı bulunamadı' })
  findOne(@Param('id') id: string) {
    return this.interestService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: "ID'ye göre ilgi alanı güncelle" })
  @ApiResponse({
    status: 200,
    description: 'İlgi alanı başarıyla güncellendi.',
    type: Interest,
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'İlgi alanı bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    return this.interestService.update(+id, updateInterestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "ID'ye göre ilgi alanı sil" })
  @ApiResponse({ status: 200, description: 'İlgi alanı başarıyla silindi.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'İlgi alanı bulunamadı' })
  remove(@Param('id') id: string) {
    return this.interestService.remove(+id);
  }
}
