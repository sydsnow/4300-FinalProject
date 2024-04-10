import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage
})

function ProfilePage() {
    const { logout, user } = useKindeAuth();
  return (
    <div>
      <h2>Hi, {user?.given_name}!</h2>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}