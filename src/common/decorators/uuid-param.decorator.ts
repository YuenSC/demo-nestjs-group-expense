import {
  createParamDecorator,
  ExecutionContext,
  ParseUUIDPipe,
} from '@nestjs/common';

export const UUIDParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[data];
    // Use ParseUUIDPipe directly for validation
    const validatedValue = new ParseUUIDPipe({
      exceptionFactory: () => new Error(`${data} should be a valid UUID`),
    }).transform(value, {
      type: 'param',
      metatype: String,
    });
    return validatedValue;
  },
);
