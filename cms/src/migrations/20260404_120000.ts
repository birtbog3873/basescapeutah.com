import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` ADD COLUMN \`preferred_date\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD COLUMN \`time_preference\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD COLUMN \`source_ga_client_id\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD COLUMN \`source_gclid\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD COLUMN \`closed_value\` numeric;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // SQLite doesn't support DROP COLUMN in older versions,
  // but D1 uses a modern SQLite that does
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`preferred_date\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`time_preference\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`source_ga_client_id\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`source_gclid\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`closed_value\`;`)
}
