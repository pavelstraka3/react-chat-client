import { createFileRoute, redirect } from "@tanstack/react-router";
import Chat from "@/components/chat.tsx";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: ({ context }) => {
    if (!context) return;

    const { isAuthenticated, isLoading } = context.auth;
    console.log("authenticated", isAuthenticated, isLoading);

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
  component: Index,
});

function Index() {
  return <Chat />;
}
