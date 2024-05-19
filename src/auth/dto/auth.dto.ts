import { Chat } from 'src/chats/dto/chat.dto';
export interface User {
  username: string;
  password: string;
  id?: number;
  contacts?: string[];
}

export interface Res {
  statusCode: number;
  message?: string;
  user?: User;
  chats?: Chat[] | [];
}
