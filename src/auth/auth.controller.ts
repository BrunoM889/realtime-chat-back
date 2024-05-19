import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseIntPipe } from '@nestjs/common';
import { User, Res } from './dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  async auth(@Body() user: User): Promise<Res> {
    return this.authService.auth(user);
  }

  @Get('/user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<Res> {
    return this.authService.getUser(id);
  }
}
