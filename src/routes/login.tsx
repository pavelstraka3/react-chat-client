import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthComponent from "@/components/login/authComponent.tsx";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (!context) return;

    const { isAuthenticated } = context.auth;

    if (isAuthenticated) {
      throw redirect({
        to: search.redirect || "/chat",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthComponent mode="login" />;
}
