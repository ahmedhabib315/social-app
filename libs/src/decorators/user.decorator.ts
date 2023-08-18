import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Status } from "src/user/enum/user.enum";

export const GetTokenData = createParamDecorator(
  (data: string | undefined,context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    
    return request.user;
  },
)

export const checkActiveStatus = createParamDecorator(
  (data: string | undefined,context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();
    
    return request.user && request.user.status == Status.active;
  },
)