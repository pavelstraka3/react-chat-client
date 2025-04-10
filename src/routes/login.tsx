import {createFileRoute} from "@tanstack/react-router";
import AuthComponent from "@/components/login/authComponent.tsx";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthComponent mode="login"/>;
}
