import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from './prisma.service';

type GetTasksParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.TaskWhereUniqueInput;
  where?: Prisma.TaskWhereInput;
  orderBy?: Prisma.TaskOrderByWithRelationInput;
};

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  //
  async task(where: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    return this.prisma.task.findUnique({ where });
  }

  async tasks(params: GetTasksParams) {
    return this.prisma.task.findMany(params);
  }

  // создание поста
  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  // обновление поста
  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    return this.prisma.task.update(params);
  }

  // удаление поста
  async removeTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({ where });
  }
}
