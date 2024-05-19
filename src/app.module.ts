import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [AuthModule, ChatsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
