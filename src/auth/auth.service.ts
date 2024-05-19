import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './dto/auth.dto';
import { Res } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async auth(user: User): Promise<Res> {
    const userFounded = await this.prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (userFounded) {
      if (userFounded.password !== user.password)
        return { statusCode: 401, message: 'Invalid password' };
      const chats = await this.prisma.chat.findMany({
        where: {
          OR: [
            { user1: userFounded.username },
            { user2: userFounded.username },
          ],
        },
      });

      return {
        statusCode: 200,
        user: userFounded,
        chats: chats,
      };
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          contacts: [],
        },
      });
      return {
        statusCode: 200,
        user: newUser,
        chats: [],
      };
    }
  }

  async getUser(id: number): Promise<Res> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ user1: user.username }, { user2: user.username }],
      },
    });

    return {
      statusCode: 200,
      user: user,
      chats: chats,
    };
  }
}
