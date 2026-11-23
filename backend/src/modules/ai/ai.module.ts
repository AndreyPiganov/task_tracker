import { Module } from '@nestjs/common';
import OpenAI from 'openai';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: OpenAI,
      useFactory: () => {
        const apiKey = process.env.OPENAI_API_KEY?.trim();
        return apiKey ? new OpenAI({ apiKey, timeout: 25_000, maxRetries: 0 }) : null;
      },
    },
  ],
})
export class AiModule {}
