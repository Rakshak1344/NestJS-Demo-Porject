import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./services/users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dto/user.dto";
import { AuthService } from "./services/auth.service";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {
  }

  @Post("/signup")
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body.email, body.password);
  }

  @Post("/signin")
  async signIn(@Body() body: CreateUserDto) {
    return await this.authService.signIn(body.email, body.password);
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    console.log("handler is running");
    const user = await this.usersService.findOneById(parseInt(id));
    console.log(user);
    return user;
  }

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Delete("/:id")
  deleteUser(@Param("id") id: string) {
    return this.usersService.removeUser(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(id), body);
  }
}
