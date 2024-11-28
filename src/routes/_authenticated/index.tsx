import { createFileRoute, redirect } from '@tanstack/react-router'
import Chat from '@/components/chat.tsx'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context?.auth
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: Index,
})

function Index() {
  return <Chat />
}
