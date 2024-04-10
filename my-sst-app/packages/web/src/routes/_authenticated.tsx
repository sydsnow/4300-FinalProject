import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export function Login() {
    const { login, register } = useKindeAuth();
    return (
        <div>
            <button onClick={() => register()} type="button">Sign up</button>
            <button onClick={() => login()} type="button">Sign In</button>
        </div>
    )
}

const Component = () => {
    const { isAuthenticated } = useKindeAuth();
    if (!isAuthenticated) {
        return <Login />;
    }
    return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
    component: Component,
});
