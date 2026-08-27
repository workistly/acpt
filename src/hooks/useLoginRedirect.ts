import { useUser } from '@/contexts/UserProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const useLoginRedirect = (signup?: boolean) => {
  const router = useRouter()
  const { status } = useSession()
  const { user, fetching } = useUser()

  useEffect(() => {
    if (status === 'loading' || fetching) {
      return
    }

    if (status === 'unauthenticated' || !user.id) {
      router.push({
        pathname: signup ? '/signup' : '/login',
        query: {
          url: router.asPath,
        },
      })
    }
  }, [status, fetching, router, user.id, signup])
}

export default useLoginRedirect
