import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvestService } from './invest.service';
import { CreateInvestDto } from './dto/create-invest.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateInvestDto } from './dto/update-invest.dto';

@Controller('invest')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class InvestController {
  constructor(private readonly investService: InvestService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Yeni bir yatırım oluştur' })
  create(@Request() req, @Body() createInvestDto: CreateInvestDto) {
    return this.investService.create(createInvestDto, req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tüm yatırımları listele' })
  findAll() {
    return this.investService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.investService.findOne(+id);
  }

  @Get('user/me')
  @Roles(Role.USER)
  findMyInvests(@Request() req) {
    return this.investService.findByUserId(req.user.userId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Yatırım durumunu güncelle (Sadece admin)' })
  update(@Param('id') id: string, @Body() updateInvestDto: UpdateInvestDto) {
    return this.investService.update(+id, updateInvestDto);
  }
}
