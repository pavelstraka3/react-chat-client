import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/authenticated")({
  beforeLoad: ({ context }) => {
    if (!context) return;
    const { isAuthenticated, isLoading } = context.auth;

    if (isLoading) return;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
