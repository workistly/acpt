import { SessionProvider } from 'next-auth/react'
import UserProvider from '@/contexts/UserProvider'
import { theme } from '@/styles/theme'
import { QUERY_STALE_TIME } from '@/utils/const'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode, useState } from 'react'

interface Props {
  children?: ReactNode
  session?: any
}

const AppProvider: FC<Props> = ({ children, session }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            staleTime: QUERY_STALE_TIME,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
          },
        },
      }),
  )

  return (
    <SessionProvider session={session}>
      <MantineProvider defaultColorScheme="light" forceColorScheme="light" theme={theme}>
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>{children}</UserProvider>
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  )
}

export default AppProvider
