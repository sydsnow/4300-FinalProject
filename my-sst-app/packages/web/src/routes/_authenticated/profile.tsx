import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form";
import { useState } from 'react';
import '../../App.css'
import { useMutation } from '@tanstack/react-query';
import { FormProvider } from 'react-hook-form';
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage
})

type Profile = {
  imageUrl?: string,
  id: integer,
  userId: string
};


function ProfilePage() {
    const { logout, user, getToken } = useKindeAuth();

    const [filePreviewURL, setFilePreviewURL] = useState<string | undefined>(undefined);

    const computeSHA256 = async (file: File) => {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    };

    const mutation = useMutation({
      mutationFn: async ({ data, image }: { data: Profile; image?: File }) => {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        if (image) {
          const signedUrlResponse = await fetch(import.meta.env.VITE_APP_API_URL + "/signed-url", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({
                contentType: image.type,
                contentLength: image.size,
                checksum: await computeSHA256(image),
            }),
          });
          if (!signedUrlResponse.ok) {
            throw new Error("Failed to get signed URL");
          }
          const { url } = await signedUrlResponse.json() as { url: string };
          console.log("url", url);

          await fetch (url, {
            method: 'PUT',
            body: image,
            headers: {
              "Content-Type": image.type,
            }
          });

          const imageUrl = url.split("?")[0];
          data.imageUrl = imageUrl;
          console.log("imageUrl", imageUrl);  
  
        }
        console.log("data", data)
        console.log("data.imageUrl", data.imageUrl)
        const res = await fetch (import.meta.env.VITE_APP_API_URL + "/profile", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({data}),
        });
        if (!res.ok) {
          throw new Error("Failed to upload image");
        }
        const json = await res.json();
        return json.data;
      }
    });

    const form = useForm({
      defaultValues: {
        image: undefined as undefined | File,
      },
      onSubmit: async ({ value }) => {
        console.log("submitting", value); 
        await mutation.mutateAsync({ data: value as Image, image: value.image });
        console.log("done");
      }})
      async function getProfile() {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const res = await fetch(
          import.meta.env.VITE_APP_API_URL + "/profile",
          {
            headers: {
              Authorization: token,
            },
          }
        );
    
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return (await res.json()) as { profile: Profile[] };
      }
      const {  data } = useQuery({
        queryKey: ["getProfile"],
        queryFn: getProfile,
      });

 
  return (
    <div>
      <h2>Hi, {user?.given_name}!</h2>
      <p>{user?.email}</p>
      <div>{data?.profile.imageUrl && <img src={profile.imageUrl}/>}</div>
      <div className="self-center">
      <FormProvider>
          <form
            className="flex flex-col gap-y-10"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="imageUrl"
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
            <button type="submit">Select</button>
            </form>
            </FormProvider>
          </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
  // return (
  //   <div>
  //     <h2>Hi, {user?.given_name}!</h2>
  //     <p>{user?.email}</p>
  //     <div className="self-center">
  //       <FormProvider>
  //         <form
  //           className="flex flex-col gap-y-10"
  //           onSubmit={(e) => {
  //             e.preventDefault();
  //             e.stopPropagation();
  //             void form.handleSubmit();
  //           }}
  //         >
  //           <form.Field
  //             name="image"
  //             children={(field) => (
  //               <div>
  //                 {data?.profile[0]?.imageUrl && (
  //                   <img
  //                     src={data.profile[0].imageUrl}
  //                     alt="Profile Picture"
  //                     id="profile-image"
  //                   />
  //                 )}
  //                 {filePreviewURL && (
  //                   <img
  //                     src={filePreviewURL}
  //                     alt="Profile Picture Preview"
  //                     id="profile-image"
  //                   />
  //                 )}
  //                 <input
  //                   type="file"
  //                   accept='image/*'
  //                   onBlur={field.handleBlur}
  //                   onChange={(e) => {
  //                     const file = e.target.files?.[0];
  //                     if (filePreviewURL) {
  //                       URL.revokeObjectURL(filePreviewURL);
  //                     }
  //                     if (file) {
  //                       const url = URL.createObjectURL(file);
  //                       setFilePreviewURL(url);
  //                     } else {
  //                       setFilePreviewURL(undefined);
  //                     }
  //                     field.handleChange(file);
  //                   }}
  //                 />
  //               </div>
  //             )}
  //           />
  //           <button type="submit">Select</button>
  //         </form>
  //       </FormProvider>
  //     </div>
  //     <button onClick={logout}>Logout</button>
  //   </div>
  // );
}
