import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { todos as todosTable } from "@my-sst-app/core/db/schema/todos";
import { db } from "@my-sst-app/core/db";
import { authMiddleware } from "@my-sst-app/core/auth";
import { PgColumn } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";


const app = new Hono();

app.get("/todos", authMiddleware, async (c) => {
    const userId = c.var.userId;
    const todos = await db.select().from(todosTable).where(eq(todosTable.userId, userId));
    return c.json({ todos });
    });

app.post("/todos", authMiddleware, async (c) => {
    const userId = c.var.userId;
    const body = await c.req.json();
    const todo = {
        ...body.todo,
        //created_at: new Date(),
        userId: userId,
    };
    const newTodo = await db.insert(todosTable).values(todo).returning();
    return c.json({ todos: newTodo });
});

export const handler = handle(app);
