import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const isHttp = context.getType() === 'http';
    const isRpc = context.getType() === 'rpc';

    if (isHttp) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = context.switchToHttp().getRequest();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!request || !request.queryRunner) {
        throw new InternalServerErrorException(
          'Query Runner 객체를 찾을 수 없습니다!',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return request.queryRunner;
    }

    if (isRpc) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const queryRunner = Reflect.getMetadata(
        'QUERY_RUNNER',
        context.getHandler(),
      );

      if (!queryRunner) {
        throw new InternalServerErrorException(
          'Query Runner 객체를 찾을 수 없습니다!',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return queryRunner;
    }
  },
);
