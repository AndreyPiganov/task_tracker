import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export function IsTaskTitle() {
  return applyDecorators(
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    IsString({ message: 'Введите название задачи.' }),
    Length(1, 200, { message: 'Название должно содержать от 1 до 200 символов.' }),
    Matches(/^[^\x00]*$/u, { message: 'Название содержит недопустимый символ.' }),
  );
}
