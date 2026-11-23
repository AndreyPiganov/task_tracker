import { IsTaskTitle } from '../../common/validation/task-title.decorator';

export class CreateTaskDto {
  @IsTaskTitle()
  title!: string;
}
