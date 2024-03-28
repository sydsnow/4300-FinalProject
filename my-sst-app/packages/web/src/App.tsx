// import { useEffect, useState } from 'react'
// import './App.css'

// type Todo = {
//   id: number, 
//   text: string,
//   userId: string,
//   createdAt: string,
// }
// function App() {
//   const [todo, setTodo] = useState<Todo[]>([]);
//   const [text, setText] = useState('');

//   useEffect(() => {
//     async function fetchTodo() {
//     const res = await fetch(import.meta.env.VITE_APP_API_URL + '/todos')
//     const data = await res.json()
//     setTodo(data.todos);
//   }
//   fetchTodo();
//   }, []);
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch(import.meta.env.VITE_APP_API_URL + '/todos', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ todo: { text } }),
//     });
//     const data = await res.json();
//     setTodo(data.todos);
//     setText('');
//   };

//   return (
//     <div className="App">
//       <div className="card">
//         {todo.map((t) => (
//           <div key={t.id}>{t.text}</div>
//         ))}
//       </div>
//         <form
//           onSubmit={handleSubmit}
//         >
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button type="submit">Add</button>
//         </form>

//       </div>
//   );
// }

// export default App
import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: number, 
  text: string,
  userId: string,
  createdAt: string,
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/todos`);
      if (!res.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await res.json();
      setTodos(data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: {
            text,
            userId: 'user-1', // Replace 'user-1' with the actual user ID
            createdAt: new Date().toISOString(), // Format date to ISO string
          },
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to add todo');
      }
      await fetchTodos(); // Fetch todos again to update the list
      setText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="App">
      <div className="card">
        {todos.map((todo) => (
          <div key={todo.id}>
            <p>{todo.text}</p>
            <p>User ID: {todo.userId}</p>
            <p>Created At: {new Date(todo.createdAt).toLocaleString()}</p> {/* Format date */}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;

