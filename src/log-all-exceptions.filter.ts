import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

const postgresErrorCodeToMessage = {
  '23505': 'Unique constraint error',
  '23503': 'Foreign key constraint error',
  '23502': 'Not null constraint error',
  '22P02': 'Invalid input syntax',
  '42703': 'Undefined column',
  '42P01': 'Undefined table',
  '42P02': 'Undefined parameter',
  '42P03': 'Duplicate cursor',
  '42P04': 'Duplicate database',
  '42P05': 'Duplicate prepared statement',
  '42P06': 'Duplicate schema',
  '42P07': 'Duplicate table',
  '42P08': 'Ambiguous parameter',
  '42P09': 'Ambiguous alias',
  '42P10': 'Invalid column reference',
  '42P11': 'Invalid cursor definition',
  '42P12': 'Invalid database definition',
  '42P13': 'Invalid function definition',
  '42P14': 'Invalid prepared statement definition',
  '42P15': 'Invalid schema definition',
  '42P16': 'Invalid table definition',
  '42P17': 'Invalid object definition',
  '42P18': 'Indeterminate datatype',
  '42P19': 'No data',
  '42P20': 'Invalid SQL statement',
  '42P21': 'Invalid schema name',
  '42P22': 'Invalid table name',
  '42P23': 'Invalid parameter name',
  '42P24': 'Invalid object name',
  '42P25': 'Invalid catalog name',
  '42P26': 'Invalid schema authorization specification',
  '42P27': 'Invalid schema element',
  '42P28': 'Invalid grantor',
  '42P29': 'Invalid grant operation',
  '42P30': 'Invalid role specification',
  '42P31': 'Invalid security label',
  '42P32': 'Invalid configuration name',
  '42P33': 'Lock not available',
  '42P34': 'Invalid cursor name',
  '42P35': 'External routine exception',
  '42P36': 'External routine invocation exception',
  '42P37': 'Invalid security privilege',
  '42P38': 'Syntax error',
  '42P39': 'Checkpoint violation',
  '42P40': 'Invalid catalog name',
  '42P41': 'Invalid schema name',
};

@Catch()
export class LogAllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(LogAllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const postgresErrorMessage = postgresErrorCodeToMessage[exception.message];

    const validationErrorMessage = Array.isArray(exception.response?.message)
      ? exception.response.message.join(', ')
      : exception.response?.message;

    const message = postgresErrorMessage || validationErrorMessage;

    this.logger.error({ ...exception, requestUrl: request.url });

    response.status(status).json({
      statusCode: status,
      message:
        `Error: ${exception.message === message ? 'Validation Error' : exception.message}` +
        (message ? ` - ${message}` : ''),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
