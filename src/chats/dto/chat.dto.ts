import { JsonValue } from '@prisma/client/runtime/library';

export interface Message {
  id: number;
  sender: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  user1: string;
  user2: string;
  messages: Message[] | JsonValue[];
}
