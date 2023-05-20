import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {
  }

  async signUp(email: string, password: string) {
    // check if email is in use
    const isUserAvailable = await this.userService.find(email);
    if (isUserAvailable) {
      throw new BadRequestException("email in use");
    }

    // hash the users password
    const salt = randomBytes(8).toString("hex");
    const hash = await scrypt(password, salt, 32) as Buffer;

    const result = salt + "." + hash.toString("hex");

    return await this.userService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException("Invalid email or password");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException("Invalid email or password");
    }

    return user;
  }

}