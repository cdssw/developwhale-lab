import { sqliteTable,text,integer,primaryKey } from 'drizzle-orm/sqlite-core';
export const metrics = sqliteTable('metrics_daily', {day:text('day').notNull(),audience:text('audience').notNull(),source:text('source').notNull(),event:text('event').notNull(),count:integer('count').notNull().default(0)},t=>[primaryKey({columns:[t.day,t.audience,t.source,t.event]})]);
