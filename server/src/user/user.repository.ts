import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service';
import { NewUser, UserRole } from './user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async findByEmailOrUsername(email: string, username: string) {
    const user = await this.dbService.db
      .selectFrom('user')
      .where(eb => eb
        .or([
          eb('email', '=', email.toLowerCase()),
          eb('username', '=', username.toLowerCase())
        ])
      )
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  async create(data: { email: string; username: string; hashedPassword: string }) {
    const newUser: NewUser = {
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      hashedPassword: data.hashedPassword,
      role: UserRole.GENERAL,
      lastActiveDate: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const insertedUser = await this.dbService.db
      .insertInto('user')
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow();

    return insertedUser;
  }

  async findById(id: string) {
    return await this.dbService.db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async findByUsername(username: string) {
    return await this.dbService.db
      .selectFrom('user')
      .where('username', '=', username)
      .selectAll()
      .executeTakeFirst();
  }
}
