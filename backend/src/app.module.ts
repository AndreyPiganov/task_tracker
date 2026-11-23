import { Module } from '@nestjs/common';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [TasksModule, AiModule, HealthModule],
})
export class AppModule {}
