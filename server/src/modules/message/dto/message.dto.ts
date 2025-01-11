export interface MessageDto {
  messages: {
    role: string;
    content: string;
  }[];
}
