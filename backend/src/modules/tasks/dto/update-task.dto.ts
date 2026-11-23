import { IsEnum, ValidateIf } from 'class-validator';
import { TaskStatus } from '../../../generated/prisma/enums';
import { IsTaskTitle } from '../../../common/validation/task-title.decorator';

export class UpdateTaskDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsTaskTitle()
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(TaskStatus, { message: 'Выберите допустимый статус задачи.' })
  status?: TaskStatus;
}
