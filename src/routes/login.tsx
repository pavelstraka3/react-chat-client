import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthComponent from "@/components/login/authComponent.tsx";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (!context) return;

    const { isAuthenticated, isLoading } = context.auth;

    if (isLoading) return;

    if (isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthComponent mode="login" />;
}
