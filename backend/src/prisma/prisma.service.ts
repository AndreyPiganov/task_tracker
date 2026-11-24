import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, DATABASE_URL } = process.env;
    if (TURSO_DATABASE_URL || TURSO_AUTH_TOKEN) {
      if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
        throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are both required');
      }
      super({ adapter: new PrismaLibSql({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN }) });
    } else {
      if (!DATABASE_URL) throw new Error('DATABASE_URL is required for local SQLite');
      super({ adapter: new PrismaBetterSqlite3({ url: DATABASE_URL }) });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
