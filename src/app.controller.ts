import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TaskService } from './task.service';
import { User as UserModel, Task as TaskModel } from '@prisma/client';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

type UserData = { username: string; password: string };
type TaskData = {
  title: string;
  description?: string;
  deadline: string;
  userUsername: string;
  priority: number;
};

@Controller('api')
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Returns the task with specified id' })
  @ApiParam({ name: 'id', required: true, description: 'Task identifier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('task/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.task({ id: Number(id) });
  }

  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Returns all published tasks' })
  @Get('feed')
  async getPublishedTasks(): Promise<TaskModel[]> {
    return this.taskService.tasks({
      where: { published: true },
    });
  }

  @ApiTags('Tasks')
  @ApiOperation({
    summary:
      'Returns all tasks that contain the specified substring in their title or description',
  })
  @ApiParam({
    name: 'searchString',
    required: true,
    description: 'Substring used for search',
  })
  @Get('filtered-tasks/:searchString')
  async getFilteredTasks(
    @Param('searchString') searchString: string,
  ): Promise<TaskModel[]> {
    return this.taskService.tasks({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            description: { contains: searchString },
          },
        ],
      },
    });
  }

  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Adds a new task' })
  @ApiParam({
    name: 'title',
    required: true,
    description: 'Task title',
  })
  @ApiParam({
    name: 'description',
    required: false,
    description: 'Description of the task',
  })
  @ApiParam({
    name: 'deadline',
    required: false,
    description: 'Task deadline',
  })
  @ApiParam({
    name: 'username',
    required: true,
    description: 'Username who created the task',
  })
  @ApiParam({
    name: 'priority',
    required: true,
    description: 'Task priority',
  })
  @Post('task')
  async createTask(@Body() taskData: TaskData): Promise<TaskModel> {
    const { title, description, deadline, userUsername, priority } = taskData;

    return this.taskService.createTask({
      title,
      description,
      deadline: new Date(deadline),
      user: {
        connect: { username: userUsername },
      },
      priority: {
        connect: { value: priority },
      },
    });
  }

  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Updates task with specified id' })
  @ApiParam({ name: 'id', required: true, description: 'Task identifier' })
  @Put('publish/:id')
  async publishTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Deletes a task with the specified id' })
  @ApiParam({ name: 'id', required: true, description: 'Task identifier' })
  @Delete('task/:id')
  async removeTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.removeTask({ id: Number(id) });
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Creates a new user with the specified data' })
  @ApiParam({ name: 'username', required: true, description: 'Username' })
  @ApiParam({ name: 'password', required: true, description: 'User password' })
  @Post('user')
  async registerUser(@Body() userData: UserData): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
