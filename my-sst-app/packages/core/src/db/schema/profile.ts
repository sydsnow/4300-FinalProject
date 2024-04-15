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

export const profile = pgTable(
    'profile', 
    {
        id: serial('id').primaryKey(),
        userId: text("user_id").notNull(),
        imageUrl: text("image_url"),
    },
    (table) => {
        return {
            nameIndex: index('profile_userId_idx').on(table.userId),
        }   
    }
);