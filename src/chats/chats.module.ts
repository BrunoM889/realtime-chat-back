import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from 'src/prisma.service';
import { ChatGateway } from './chat.gateway';
@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, ChatGateway],
})
export class ChatsModule {}
