import { queryData } from '@/api/exam'
import AppHead from '@/components/Layout/AppHead'
import AppLayout from '@/components/Layout/AppLayout'
import PageLoader from '@/components/Loader/PageLoader'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import PaymentForm from '@/modules/payment/PaymentForm'
import { Trans, useLingui } from '@lingui/react/macro'
import { Box, Button, Center, Container, Divider, Flex, Group, List, Stack, Text, Title } from '@mantine/core'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Props {}

const PaymentPage: FC<Props> = () => {
  useLoginRedirect()
  const router = useRouter()
  const { t } = useLingui()
  const { fetching } = useUser()

  const certId = router.query.id as string

  const [purchasing, setPurchasing] = useState(false)
  const [certData, setCertData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buyClicked, setBuyClicked] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const resp = await queryData('certificates', 'certificateNumber', Number(certId))
    setLoading(false)
    if (resp.status && resp.fullData.length > 0) {
      setCertData(resp.fullData[0])
    } else {
      setCertData(null)
    }
  }

  const FEATURES = useMemo(
    () => [
      t`Valid for 2 years`,
      t`Downloadable as a PDF`,
      t`Includes certificate ID number`,
      t`Personalized certificate URL`,
    ],
    [t],
  )

  if (fetching) return <PageLoader />

  return (
    <AppLayout hideLanguage hideProfile>
      <AppHead title={t`Payment Information`} />

      <Container>
        <Box className="my-10 md:my-10">
          <Title fz={24} mb={32}>
            <Trans>Payment Information</Trans>
          </Title>

          {loading ? (
            <PageLoader />
          ) : !certData ? (
            <Center>
              <Title className="text-center">
                <Trans>Payment not found</Trans>
              </Title>
            </Center>
          ) : (
            <Flex className="max-md:flex-col gap-4 sm:gap-12">
              <Stack className="md:flex-3">
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: Number(certData.price),
                    currency: 'usd',
                    appearance: {
                      variables: {
                        colorText: '#3F3F3F',
                        fontSizeBase: '16px',
                      },
                    },
                  }}
                >
                  <PaymentForm
                    certData={certData}
                    setBuyClicked={setBuyClicked}
                    buyClicked={buyClicked}
                    btnDisable={btnDisable}
                    setBtnDisable={setBtnDisable}
                    certId={certId}
                    purchasing={purchasing}
                    setPurchasing={setPurchasing}
                    price={certData.price ? Number(certData.price) : 1}
                  />
                </Elements>
              </Stack>

              <Stack className="md:flex-2 gap-xl">
                <Stack className="p-4 sm:p-6 border border-gray-200">
                  <Group className="justify-between">
                    <Text className="text-lg">
                      <Trans>Official Certificate</Trans>
                    </Text>

                    <Text className="text-lg font-semibold">${certData.price}</Text>
                  </Group>

                  <Divider />

                  <Group className="justify-between" mb={8}>
                    <Text className="text-lg">
                      <Trans>Total</Trans>
                    </Text>

                    <Text className="text-lg font-semibold">${certData.price}</Text>
                  </Group>

                  <Group className="justify-center">
                    <Button onClick={() => setBuyClicked(true)} disabled={btnDisable} loading={purchasing}>
                      <Trans>Buy Now</Trans>
                    </Button>
                  </Group>
                </Stack>

                <Stack className="p-4 sm:p-6 border border-gray-200">
                  <Text className="text-lg font-semibold">Features:</Text>

                  <List spacing="sm">
                    {FEATURES.map((el) => (
                      <List.Item key={el}>{el}</List.Item>
                    ))}
                  </List>
                </Stack>
              </Stack>
            </Flex>
          )}
        </Box>
      </Container>
    </AppLayout>
  )
}

export default PaymentPage
