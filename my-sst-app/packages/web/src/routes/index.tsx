import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: TodoPage,
})

function TodoPage() {

  return (
    <div>Welcome to your TODO List!</div>
  );
}

export default TodoPage