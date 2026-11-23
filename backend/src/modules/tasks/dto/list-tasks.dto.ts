import { IsEnum, ValidateIf } from 'class-validator';
import { TaskStatus } from '../../../generated/prisma/enums';

export class ListTasksDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(TaskStatus, { message: 'Выберите допустимый статус задачи.' })
  status?: TaskStatus;
}
