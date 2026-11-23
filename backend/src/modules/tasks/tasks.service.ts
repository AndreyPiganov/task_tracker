import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { TaskStatus } from '../../generated/prisma/enums';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasks: TasksRepository) {}

  list(status?: TaskStatus) {
    return this.tasks.findAll(status);
  }

  create(title: string) {
    return this.tasks.create(title);
  }

  async update(id: string, data: UpdateTaskDto) {
    if (data.title === undefined && data.status === undefined) {
      throw new BadRequestException('Передайте название или статус задачи.');
    }

    const task = await this.tasks.update(id, data);
    if (!task) {
      throw new NotFoundException('Задача не найдена.');
    }

    return task;
  }

  async delete(id: string) {
    if (!(await this.tasks.delete(id))) {
      throw new NotFoundException('Задача не найдена.');
    }
  }
}
