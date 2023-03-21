import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { createPaginator, PaginateFunction } from 'prisma-pagination';

export const GetPaginate = createParamDecorator(
  (data: number | undefined, ctx: ExecutionContext): PaginateFunction => {
    const { perPage, page } = ctx.switchToHttp().getRequest();
    const paginate = createPaginator({ page, perPage: perPage || 20 });
    return paginate;
  },
);
