import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export function createParseFilePipe(options?: { fileIsRequired?: boolean }) {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: '.(png|jpeg|jpg)',
    })
    .addMaxSizeValidator({
      maxSize: 1_000_000, // 1MB
      message: 'The maximum file size is 1MB.',
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      fileIsRequired: options?.fileIsRequired ?? false,
    });
}
