import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStatus } from '@/hooks/useAuthStatus'

interface Props {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function ProtectedRoute({ children, requireAuth = true }: Props) {
  const { session, status } = useAuthStatus()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      const currentPath = router.asPath
      router.push({
        pathname: '/login',
        query: { url: currentPath },
      })
    }
  }, [status, requireAuth, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (requireAuth && !session) {
    return null
  }

  return <>{children}</>
}
