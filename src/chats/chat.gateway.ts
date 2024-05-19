import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server;

  constructor(private readonly chatsService: ChatsService) {}

  private sessions: { username: string; socket: Socket }[] = [];

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: { to: string; message: string }) {
    const from = client.handshake.auth.username;
    const { to, message } = data;

    const toSession = this.sessions.find((session) => session.username === to);

    if (toSession) {
      toSession.socket.emit('message', {
        data: {
          from: from,
          message: message,
        },
      });
    }
    console.log(`---------------- new message ----------------\n`);
    console.log(`from: ${from}\nto: ${to}\nmessage: ${message}\n`);

    await this.chatsService.updateChat(from, to, message);
  }

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { username } = socket.handshake.auth;

      console.log(`---------------- ${username}, connected ----------------\n`);

      const newSession = {
        username: username,
        socket: socket,
      };

      this.sessions = this.sessions.filter(
        (session) => session.username !== username,
      );

      this.sessions.push(newSession);
    });

    this.server.on('disconnect', (socket: Socket) => {
      const { username } = socket.handshake.auth;
      console.log(
        `---------------- ${username}, disconnected ----------------\n`,
      );

      this.sessions = this.sessions.filter(
        (session) => session.socket.id !== socket.id,
      );
    });
  }
}
