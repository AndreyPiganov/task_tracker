import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GenerateSubtasksDto } from './dto/generate-subtasks.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('subtasks')
  @HttpCode(200)
  generate(@Body() dto: GenerateSubtasksDto) {
    return this.ai.generate(dto.title);
  }
}
