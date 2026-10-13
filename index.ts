import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Fallback URL lets `next build` import this module on Netlify without env vars.
// At runtime, Arena / production should set DATABASE_URL (takes priority).
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const needsSsl = /neon\.tech|supabase\.co|sslmode=require/i.test(databaseUrl);

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 8,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
