import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// ═══════════════════════════════════════════════════════════════════════
// Prisma Client Initialization — SQLite (production-safe)
// ═══════════════════════════════════════════════════════════════════════
// V.56: Reverted to SQLite (matches schema.prisma provider = "sqlite").
// The DB file lives at /app/db/custom.db on HuggingFace Space.
//
// If DATABASE_URL env var is set and starts with "file:", use it directly.
// If DATABASE_URL is set to a PostgreSQL URL (legacy), override with SQLite
// to match the schema.prisma provider.
// If DATABASE_URL is not set, default to ./db/custom.db (local dev).
// ═══════════════════════════════════════════════════════════════════════

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL

  // V.56: If DATABASE_URL is a file: URL, use it directly (SQLite)
  if (envUrl && envUrl.trim().startsWith('file:')) {
    return envUrl.trim()
  }

  // V.56: If DATABASE_URL is a PostgreSQL URL but schema uses SQLite,
  // override with SQLite to prevent PrismaClientInitializationError.
  // This happens when HF Space Secrets still have the old PostgreSQL URL.
  if (envUrl && envUrl.trim().startsWith('postgresql:')) {
    console.log('[DB] V.56: DATABASE_URL is PostgreSQL but schema uses SQLite — overriding to SQLite')
    return 'file:/app/db/custom.db'
  }

  // Default: local development SQLite path
  const defaultPath = process.cwd() + '/db/custom.db'
  console.log('[DB] No DATABASE_URL set, using default SQLite:', defaultPath)
  return `file:${defaultPath}`
}

const databaseUrl = resolveDatabaseUrl()

// Mask credentials when logging — never print the password.
function maskUrl(url: string): string {
  if (url.startsWith('file:')) {
    return url // No credentials in file: URLs
  }
  try {
    const u = new URL(url)
    if (u.password) u.password = '***'
    if (u.username) u.username = u.username // keep username for debugging
    return u.toString()
  } catch {
    return url.replace(/:[^:@/]+@/, ':***@')
  }
}

console.log('[DB] Using DATABASE_URL:', maskUrl(databaseUrl))

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  datasourceUrl: databaseUrl,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
