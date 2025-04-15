import { createFileRoute } from "@tanstack/react-router";
import Chat from "@/components/chat.tsx";

export const Route = createFileRoute("/_authenticated/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
