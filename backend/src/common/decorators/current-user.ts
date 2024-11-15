import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/authenticated-user';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user: AuthenticatedUser = ctx.switchToHttp().getRequest().user;

    if (!user) {
      return null;
    }

    return user.userId;
  },
);
