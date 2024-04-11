import { Outlet, Link } from "@tanstack/react-router";

import { type QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext } from "@tanstack/react-router";

//import { NotFound } from "@/components/not-found";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: RootLayout,
    //notFoundComponent: NotFound,
  });

  function RootLayout() {
    const { isAuthenticated } = useKindeAuth();
    return (
      <>
        <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
            <Link to="/todos" className="[&.active]:font-bold">
            Todo List
            </Link>{" "}
        {isAuthenticated && (
            <Link to="/create" className="[&.active]:font-bold">
            Create Todo
            </Link>)}{" "}
        {isAuthenticated && (
            <Link to="/profile" className="[&.active]:font-bold">
            Profile
            </Link>)}{" "}   
        </div>
        <hr />
        <div className="bg-background text-foreground flex flex-col m-10 gap-y-10 max-w-2xl mx-auto">
          <Outlet />
        </div>
      </>
    );
  }
