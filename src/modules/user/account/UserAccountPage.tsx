import TabButton from '@/components/Button/TabButton'
import AppHead from '@/components/Layout/AppHead'
import AppLayout from '@/components/Layout/AppLayout'
import TestProvider from '@/contexts/TestProvider'
// import PageLoader from '@/components/Loader/PageLoader'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import AccountInfo from '@/modules/user/account/AccountInfo'
import TestTable from '@/modules/user/account/TestTable'
import { useLingui } from '@lingui/react/macro'
import { Container, Group, ScrollArea, Stack } from '@mantine/core'
import { FC, useMemo, useState } from 'react'

enum TABS {
  TESTS,
  INFO,
}

interface Props {}

const UserAccountPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()
  const [tab, setTab] = useState(TABS.TESTS)

  const MENU = useMemo(
    () => [
      {
        title: t`My Tests`,
        onClick: () => setTab(TABS.TESTS),
      },
      {
        title: t`Personal Info`,
        onClick: () => setTab(TABS.INFO),
      },
    ],
    [t],
  )

  if (fetching) return <>{/* <pageLoader /> */}</>

  return (
    <AppLayout>
      <AppHead title={t`My Account`} />

      <Container className="py-10">
        <Stack className="gap-6">
          <ScrollArea type="never" className="border-b-2 border-red-600">
            <Group className="gap-3 flex-nowrap">
              {MENU.map((el, index) => (
                <TabButton key={el.title} active={index === tab} onClick={() => setTab(index)}>
                  {el.title}
                </TabButton>
              ))}
            </Group>
          </ScrollArea>
          <TestProvider>{tab === TABS.TESTS && <TestTable />}</TestProvider>
          {tab === TABS.INFO && <AccountInfo />}
        </Stack>
      </Container>
    </AppLayout>
  )
}

export default UserAccountPage
