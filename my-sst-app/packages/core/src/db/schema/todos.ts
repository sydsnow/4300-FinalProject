import {
    pgTable,
    text,
    varchar,
    timestamp,
    index,
    numeric,
    serial,
    date,
  } from "drizzle-orm/pg-core";

export const todos = pgTable(
    'todos', 
    {
        id: serial('id').primaryKey(),
        userId: text("user_id").notNull(),
        text: varchar('text', { length: 256 }),
        // createdAt: timestamp("created_at", { withTimezone: true })
        //     .notNull()
        //     .defaultNow(),
    },
    (table) => {
        return {
            nameIndex: index('userId_idx').on(table.userId),
        }   
    }
);