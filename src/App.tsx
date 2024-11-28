import {AuthProvider, useAuth} from "@/auth/auth.tsx";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "@/routeTree.gen.ts";

const router = createRouter({ routeTree, context: { auth: {isAuthenticated: false, token: ""} } });

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;