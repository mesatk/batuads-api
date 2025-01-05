import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles.decorator';

@Controller('example')
export class SomeController {
  @Get('admin-only')
  @UseGuards(AuthGuard)
  @Roles('admin')
  adminEndpoint() {
    return 'Bu endpoint sadece admin rolüne sahip kullanıcılar tarafından erişilebilir';
  }

  @Get('user-endpoint')
  @UseGuards(AuthGuard)
  @Roles('admin', 'user')
  userEndpoint() {
    return 'Bu endpoint hem admin hem de user rolüne sahip kullanıcılar tarafından erişilebilir';
  }
}
