import { Body, Controller, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() data: { user1: string; user2: string; contacts: string[] }) {
    return this.chatsService.create(data.user1, data.user2, data.contacts);
  }
}
