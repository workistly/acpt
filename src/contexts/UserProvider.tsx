import { useSession, signOut } from 'next-auth/react'
import { getDocument } from '@/api/doc'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'

interface UserContextType {
  id: string | undefined
  email: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  type: string | undefined
  provider: string | undefined
  examsCompleted: number
  examsAttempted: number
  imgId: string
  imgUrl: string
}

const useContextHook = () => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserContextType>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    type: '',
    provider: '',
    examsCompleted: 0,
    examsAttempted: 0,
    imgId: '',
    imgUrl: '',
  })
  const [fetching, setFetching] = useState<boolean>(true)

  const clearUser = () => {
    setUser({
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      type: '',
      provider: '',
      examsCompleted: 0,
      examsAttempted: 0,
      imgId: '',
      imgUrl: '',
    })
  }

  useEffect(() => {
    const loadUserData = async () => {
      if (status === 'loading') {
        return
      }

      if (status === 'unauthenticated' || !session?.user) {
        clearUser()
        setFetching(false)
        return
      }

      if (session?.user?.id) {
        try {
          const userDoc = await getDocument(session.user.id, 'users')

          if (userDoc.exists && userDoc.status) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: session.user.firstName || userDoc.data?.firstName || '',
              lastName: session.user.lastName || userDoc.data?.lastName || '',
              type: userDoc.data?.type || 'user',
              provider: 'credentials',
              examsCompleted: userDoc.data?.completed_exams || 0,
              examsAttempted: userDoc.data?.attempted_exams || 0,
              imgId: userDoc.data?.img_id || '',
              imgUrl: userDoc.data?.img_url || '',
            })
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: session.user.firstName || '',
              lastName: session.user.lastName || '',
              type: 'user',
              provider: 'credentials',
              examsCompleted: 0,
              examsAttempted: 0,
              imgId: '',
              imgUrl: '',
            })
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.firstName || '',
            lastName: session.user.lastName || '',
            type: 'user',
            provider: 'credentials',
            examsCompleted: 0,
            examsAttempted: 0,
            imgId: '',
            imgUrl: '',
          })
        }
      }

      setFetching(false)
    }

    loadUserData()
  }, [session, status])

  return {
    user,
    setUser,
    fetching: status === 'loading' || fetching,
    setFetching,
  }
}

type StorageHook = ReturnType<typeof useContextHook>

const UserContext = createContext<StorageHook>({} as any)

type Props = {
  children?: ReactNode
}

const UserProvider: FC<Props> = ({ children }) => {
  const props = useContextHook()
  return <UserContext.Provider value={props}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

export default UserProvider
