import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule, AiModule, HealthModule],
})
export class AppModule {}
