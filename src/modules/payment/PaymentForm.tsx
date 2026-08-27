import { addDocInCollection } from '@/api/exam'
import { updateCollection } from '@/api/transactions'
import NextImage from '@/components/Image/NextImage'
import { LANGUAGES } from '@/utils/const'
import COUNTRIES from '@/utils/countries'
import { Trans, useLingui } from '@lingui/react/macro'
import { Group, Select, Stack, Text, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { PaymentIntentResult, StripeCardNumberElement } from '@stripe/stripe-js'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import cards from './assets/cards.svg'

interface Props {
  certId: string
  price: number
  certData: any
  btnDisable: boolean
  buyClicked: boolean
  setBuyClicked: (value: boolean) => void
  setBtnDisable: (value: boolean) => void
  purchasing: boolean
  setPurchasing: (value: boolean) => void
}
const PaymentForm: FC<Props> = ({
  certId,
  price,
  certData,
  btnDisable,
  buyClicked,
  setBuyClicked,
  setBtnDisable,
  purchasing,
  setPurchasing,
}) => {
  const { t } = useLingui()
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [country, setCountry] = useState('')
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [cvc, setCvc] = useState('')

  const language = LANGUAGES.find((lang) => lang.value === router.locale)?.label || 'English'

  const submitInfo = async (cardEl: any) => {
    try {
      if (!stripe || !elements) {
        return null
      }

      setPurchasing(true)

      const { error: submitError } = await elements.submit()

      if (submitError) {
        showNotification({
          message: submitError.message,
          color: 'red',
        })

        setPurchasing(false)

        return null
      }

      const resp1 = await fetch(process.env.NEXT_PUBLIC_PROCESS_PAYMENT as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'usd',
        }),
      })
      const data = await resp1.json()
      const clientSecret = data.paymentIntent

      const resp: PaymentIntentResult = await stripe?.confirmCardPayment(`${clientSecret}`, {
        payment_method: {
          card: cardEl,
          billing_details: {
            name,
          },
        },
      })

      setPurchasing(false)
      if (resp.paymentIntent && resp.paymentIntent.status === 'succeeded') {
        await addDocInCollection('transactions', {
          transactionId: resp.paymentIntent.id,
          certificateNumber: certId,
          amount: price,
          language,
          transactionDate: new Date().getTime(),
          month: new Date().getMonth() + 1,
        })

        await updateCollection('exams_completed', certData.examId, {
          payment: 'Paid',
        })

        await updateCollection('certificates', certData.docId, {
          paid: true,
        })

        router.push(`/user/certificate/${certData.docId}`)
      } else {
        console.log(resp)
        showNotification({
          message: t`Payment failed. Please try again.`,
          color: 'red',
        })
      }
    } catch (e: any) {
      console.log(e)
      setPurchasing(false)
      showNotification({
        message: t`An unknown error occurred.`,
        color: 'red',
      })
    }
  }

  const generateStripeToken = async () => {
    if (!elements || !stripe) {
      return
    }

    const cardNumberElement = elements.getElement(CardNumberElement)

    const { token, error } = await stripe.createToken(cardNumberElement as StripeCardNumberElement, {
      name,
    })

    if (error || !token) {
      showNotification({
        message: error.message,
        color: 'red',
      })
      return
    }

    await submitInfo(cardNumberElement)
    return token
  }

  useEffect(() => {
    if (buyClicked) {
      setBuyClicked(false)
      generateStripeToken()
    }
  }, [buyClicked])

  useEffect(() => {
    if (name !== '' && cardNumber !== '' && expMonth !== '' && cvc !== '' && country !== '') {
      setBtnDisable(false)
    } else {
      setBtnDisable(true)
    }
  }, [name, cardNumber, expMonth, cvc, country])

  return (
    <Stack className="gap-6">
      <Select
        searchable
        data={COUNTRIES}
        label={t`Select country`}
        placeholder={t`Country`}
        value={country}
        onChange={(val) => setCountry(val || '')}
        error={!country}
      />

      <Stack className="p-4 sm:p-6 border border-gray-200">
        <Group>
          <Text className="text-lg font-semibold flex-1">
            <Trans>Credit or Debit Card</Trans>
          </Text>

          <NextImage src={cards} />
        </Group>

        <TextInput
          label={t`Name on Card`}
          placeholder={t`e.g Jogn Smith`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Stack gap={4}>
          <Text component="label" htmlFor="card-nr">
            <Trans>Card Number</Trans>
          </Text>

          <CardNumberElement
            id="card-nr"
            onChange={(e) => (e.empty ? setCardNumber('') : setCardNumber('a'))}
            className="h-[50px] border border-gray-400 p-4"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                },
              },
            }}
          />
        </Stack>

        <Group>
          <Stack flex={1} gap={4}>
            <Text component="label" htmlFor="card-expiry">
              <Trans>Card Expiry</Trans>
            </Text>

            <CardExpiryElement
              id="card-expiry"
              onChange={(e) => (e.empty ? setExpMonth('') : setExpMonth('a'))}
              className="h-[50px] border border-gray-400 p-4"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Stack>

          <Stack flex={1} gap={4}>
            <Text component="label" htmlFor="card-cvc">
              <Trans>Security Code</Trans>
            </Text>

            <CardCvcElement
              id="card-cvc"
              onChange={(e) => (e.empty ? setCvc('') : setCvc('a'))}
              className="h-[50px] border border-gray-400 p-4"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Stack>
        </Group>
      </Stack>
    </Stack>
  )
}

export default PaymentForm
