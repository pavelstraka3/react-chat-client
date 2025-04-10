import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/authenticated")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context?.auth;
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
