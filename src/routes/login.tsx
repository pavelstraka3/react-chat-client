import { createFileRoute } from "@tanstack/react-router";
import LoginComponent from "@/components/login/loginComponent.tsx";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginComponent />;
}
