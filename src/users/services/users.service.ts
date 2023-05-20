import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async find(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    Object.assign(user, attrs);

    return this.repo.save(user);

  }

  async removeUser(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    await this.repo.remove(user);
  }


}
