import { Injectable } from '@nestjs/common';
import type { Task, TaskStatus } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type TaskUpdate = Partial<Pick<Task, 'title' | 'status'>>;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: TaskStatus) {
    return this.prisma.task.findMany({
      where: { status },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  create(title: string) {
    return this.prisma.task.create({ data: { title } });
  }

  async update(id: string, data: TaskUpdate) {
    const [task] = await this.prisma.task.updateManyAndReturn({ where: { id }, data });
    return task;
  }

  async delete(id: string) {
    const { count } = await this.prisma.task.deleteMany({ where: { id } });
    return count === 1;
  }
}
