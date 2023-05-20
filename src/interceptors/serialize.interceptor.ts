import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { UserDto } from "../users/dto/user.dto";

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dio: ClassConstructor<any>) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data: any) => {
        return plainToInstance(UserDto, data, {
          excludeExtraneousValues: true
        });
      })
    );

  }


}