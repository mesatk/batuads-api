import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles.decorator';

@Controller('example')
export class SomeController {}
