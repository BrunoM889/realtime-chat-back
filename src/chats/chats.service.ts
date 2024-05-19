import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Message } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async updateUserContacts(
    user: string,
    userToAppend: string,
    contacts: string[],
  ) {
    console.log(contacts);
    await this.prisma.user.update({
      where: {
        username: user,
      },
      data: {
        contacts: [...contacts, userToAppend],
      },
    });
  }

  // create a new chat between two users and return the chat object
  async create(user1: string, user2: string, contacts: string[]) {
    // check if the chat already exists
    const userExists = await this.prisma.user.findUnique({
      where: {
        username: user2,
      },
    });
    if (!userExists) return { statusCode: 404, message: 'User not found' };

    // check if the chat already exists
    const chatExists = await this.prisma.chat.findMany({
      where: {
        OR: [
          { user1: user1, user2: user2 },
          { user1: user2, user2: user1 },
        ],
      },
    });
    // if the chat already exists return the chat object
    if (chatExists.length !== 0) {
      return { statusCode: 200, chat: chatExists[0] };
    }

    // if the chat doesn't exist create it and update the users contacts
    this.updateUserContacts(user1, user2, contacts);
    this.updateUserContacts(user2, user1, userExists.contacts);

    const newChat = await this.prisma.chat.create({
      data: {
        user1,
        user2,
        messages: [],
      },
    });
    return { statusCode: 200, chat: newChat };
  }

  async updateChat(user1: string, user2: string, message: string) {
    const chat = await this.prisma.chat.findMany({
      where: {
        OR: [
          { user1: user1, user2: user2 },
          { user1: user2, user2: user1 },
        ],
      },
    });

    const dateNow = new Date().toLocaleString();

    if (chat[0].messages.length === 0) {
      await this.prisma.chat.update({
        where: {
          id: chat[0].id,
        },
        data: {
          messages: [
            {
              sender: '$date$',
              text: dateNow.slice(0, 9),
              createdAt: dateNow,
            },
            {
              text: message,
              sender: user1,
              createdAt: dateNow,
            },
          ],
        },
      });
      return;
    }

    const lastMessage = chat[0].messages[
      chat[0].messages.length - 1
    ] as unknown as Message;

    if (lastMessage.createdAt.slice(0, 9) !== dateNow.slice(0, 9)) {
      await this.prisma.chat.update({
        where: {
          id: chat[0].id,
        },
        data: {
          messages: [
            ...chat[0].messages,
            {
              sender: '$date$',
              text: dateNow.slice(0, 9),
              createdAt: dateNow,
            },
            {
              text: message,
              sender: user1,
              createdAt: dateNow,
            },
          ],
        },
      });
    } else {
      await this.prisma.chat.update({
        where: {
          id: chat[0].id,
        },
        data: {
          messages: [
            ...chat[0].messages,
            {
              text: message,
              sender: user1,
              createdAt: dateNow,
            },
          ],
        },
      });
    }
  }
}
