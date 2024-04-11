import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form";
import { useState } from 'react';
import '../../App.css'


export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage
})

function ProfilePage() {
    const { logout, user } = useKindeAuth();

    const [filePreviewURL, setFilePreviewURL] = useState<string | undefined>(undefined);

    const form = useForm({
      defaultValues: {
        image: undefined as undefined | File,
      },
      // onSubmit: async ({ value }) => {
      //   const data = {
      //     amount: value.amount,
      //     title: value.title,
      //     date: value.date.toISOString().split("T")[0],
      //   };
      //   await mutation.mutateAsync({ data, image: value.image });
      //   console.log("done");
      //   navigate({ to: "/all-expenses" });
      // },
      // validatorAdapter: zodValidator,
    });
  return (
    <div>
      <h2>Hi, {user?.given_name}!</h2>
      <p>{user?.email}</p>
      <div className="self-center">
            <form.Field
              name="image"
              children={(field) => (
                <div>
                    {filePreviewURL && <img src={filePreviewURL} alt="Profile Picture" id="profile-image"/>}
                  <input
                    type="file"
                    accept='image/*'
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (filePreviewURL) {
                        URL.revokeObjectURL(filePreviewURL);
                      }
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFilePreviewURL(url);
                      } else {
                        setFilePreviewURL(undefined);
                      }
                      field.handleChange(file)}}
                  />
                </div>
              )}
            />
          </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}