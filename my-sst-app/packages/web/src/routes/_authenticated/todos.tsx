import { createFileRoute } from '@tanstack/react-router'
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/_authenticated/todos')({
  component: HomePage
})


type Todo = {
    id: number, 
    text: string,
    userId: string,
}

function HomePage() {
  const { getToken } = useKindeAuth();
  async function getAllTodos() {
    const token = await getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const res = await fetch(
      import.meta.env.VITE_APP_API_URL + "/todos",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    return (await res.json()) as { todos: Todo[] };
  }

  const { error, data } = useQuery({
    queryKey: ["getAllTodos"],
    queryFn: getAllTodos,
  });

  return (
    <>
      <h2>Todo List</h2>
      {error ? (
        "An error has occurred: " + error.message
      ) : (
        <ul>
          {data?.todos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      )}
    </>
  );
}
