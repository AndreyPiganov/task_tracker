import { readFile, readdir } from 'node:fs/promises';
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  throw new Error('Connect TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to this Vercel environment.');
}

const migrations = new URL('../prisma/migrations/', import.meta.url);
const entries = await readdir(migrations, { withFileTypes: true });
const names = entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const client = createClient({ url, authToken });
try {
  await client.execute('CREATE TABLE IF NOT EXISTS "_tracker_migrations" ("name" TEXT PRIMARY KEY)');
  for (const name of names) {
    const sql = await readFile(new URL(name + '/migration.sql', migrations), 'utf8');
    const tx = await client.transaction('write');
    try {
      const applied = await tx.execute({
        sql: 'SELECT 1 FROM "_tracker_migrations" WHERE name = ?',
        args: [name],
      });
      if (applied.rows.length === 0) {
        await tx.executeMultiple(sql);
        await tx.execute({ sql: 'INSERT INTO "_tracker_migrations" (name) VALUES (?)', args: [name] });
      }
      await tx.commit();
    } finally {
      tx.close();
    }
  }
} finally {
  client.close();
}
