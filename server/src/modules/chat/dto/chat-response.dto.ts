import { Expose } from 'class-transformer';

export class ChatResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  lastActivityAt: Date;

  @Expose()
  createdAt: Date;
}
