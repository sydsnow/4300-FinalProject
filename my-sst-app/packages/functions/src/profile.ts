import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { profile as profileTable } from "@my-sst-app/core/db/schema/profile";
import { db } from "@my-sst-app/core/db";
import { authMiddleware } from "@my-sst-app/core/auth";
import { PgColumn } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";


const app = new Hono();

app.get("/profile", authMiddleware, async (c) => {
    const userId = c.var.userId;
    const profile = await db.select().from(profileTable).where(eq(profileTable.userId, userId));
    return c.json({ profile });
    });

app.post("/profile", authMiddleware, async (c) => {
    const userId = c.var.userId;
    const body = await c.req.json();
    const profile = {
        ...body.profile,
        userId: userId,
    };
    const newProfile = await db.insert(profileTable).values(profile).returning();
    return c.json({ profile: newProfile });
});

export const handler = handle(app);
