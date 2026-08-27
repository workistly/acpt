import TestProvider from '@/contexts/TestProvider'
import TestPage from '@/modules/test/TestPage'
import { NextPage } from 'next'

const Index: NextPage = () => {
  return (
    <TestProvider>
      <TestPage />
    </TestProvider>
  )
}

export default Index
