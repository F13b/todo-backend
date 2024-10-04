import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { TaskService } from './task.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, UserService, TaskService],
})
export class AppModule {}
