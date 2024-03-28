import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { todos as todosTable } from "@my-sst-app/core/db/schema/todos";
import { db } from "@my-sst-app/core/db";

const app = new Hono();


app.get("/todos", async (c) => {
    const todos = await db.select().from(todosTable);
    return c.json({ todos });
    });

app.post("/todos", async (c) => {
    const body = await c.req.json();
    const todo = {
        ...body.todo,
        created_at: new Date(),
        userId: "user-1",
    };
    const newTodo = await db.insert(todo).values(todosTable).returning();
    return c.json({ todos: newTodo });
});

export const handler = handle(app);