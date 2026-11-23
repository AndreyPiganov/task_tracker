import { IsTaskTitle } from '../../common/validation/task-title.decorator';

export class GenerateSubtasksDto {
  @IsTaskTitle()
  title!: string;
}
