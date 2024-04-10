import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useNavigate } from "@tanstack/react-router";

//import { useQuery } from 'react-query';

export const Route = createFileRoute('/_authenticated/create')({
  component: CreatePage
})

type Todo = {
    id: number, 
    text: string,
    //userId: string,
}

function CreatePage() {
    const navigate = useNavigate({ from: "/create" });

    const [text, setText] = useState('');
    const { getToken } = useKindeAuth();
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const token = await getToken();
            if (!token) {
                throw new Error("No token found");
            }
            
            const res = await fetch(import.meta.env.VITE_APP_API_URL + "/todos", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    todo: {
                        text,
                        //userId: userId, // Replace 'user-1' with the actual user ID
                        //createdAt: new Date().toISOString(), // Format date to ISO string
                    },
                }),
            });
            console.log("res", res)
            if (!res.ok) {
                console.log("res not okay")
                throw new Error("Something went wrong");
            }
    
            setText('');
            navigate({ to: "/todos" });
            return (await res.json()) as { todos: Todo[] };
        } catch (error) {
            // Handle errors gracefully
            console.error("Error:", error);
            // You can also show a user-friendly error message to the user
            // Notify the user about the error or log it for further investigation
        }
    }
    

//   const { error } = useQuery({
//     queryKey: ["handleSubmit"],
//     queryFn: handleSubmit,
//   });
//   const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       try {
//         const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/todos`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             todo: {
//               text,
//               userId: 'user-1', // Replace 'user-1' with the actual user ID
//               //createdAt: new Date().toISOString(), // Format date to ISO string
//             },
//           }),
//         });
//         if (!res.ok) {
//           throw new Error('Failed to add todo');
//         }
//         // await fetchTodos(); // Fetch todos again to update the list
//         // setText('');
//       } catch (error) {
//         console.error('Error adding todo:', error);
//       }
//     };
  return (
    <div className="App">
      <h2>Create Todo</h2>
      {/* {error ? (
        "An error has occurred: " + error.message
      ) : ( */}
        <form onSubmit={handleSubmit}>
         <input
           type="text"
           value={text}
           onChange={(e) => setText(e.target.value)}
           id='text-field'
         />
         <button type="submit">Add</button>
       </form>
      {/* )} */}
     </div>
  )
}