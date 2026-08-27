import AppHead from '@/components/Layout/AppHead'
import AppLayout from '@/components/Layout/AppLayout'
import PageLoader from '@/components/Loader/PageLoader'
import { useUser } from '@/contexts/UserProvider'
import CertificateFile from '@/modules/user/certificate/CertificateFile'
import { Trans, useLingui } from '@lingui/react/macro'
import { Center, Container, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const today = new Date()

interface Props {}

const UserCertificatePage: FC<Props> = () => {
  const { t } = useLingui()
  const { fetching, user } = useUser()
  const router = useRouter()

  const id = router.query.id as string

  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)
  const [certificateData, setCertificateData] = useState<any>()

  const getCertificateInfo = async (id: string) => {
    setLoading(true)

    const resp = await fetch(process.env.NEXT_PUBLIC_GET_CERTIFICATE_BY_ID as string, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docId: id,
      }),
    })
    const data = await resp.json()

    if (data.status) {
      if (data.expired && user.id !== '') {
        setExpired(true)
        setLoading(false)
      } else if (data.expired && user.id === '') {
        console.log('router.push')
        // router.push(`/`);
      } else {
        setCertificateData(data.data)
        // try {
        //   const img: any =
        //     data.data && data.data.imageUrl
        //       ? await imageUrlToBase64(data.data.imageUrl)
        //       : "/public/images/user-image.jpg";
        //
        //   setImgToUse(img);
        // } catch (error) {
        //   setImgToUse("/public/images/user-image.jpg");
        // }
      }
    } else {
      console.log('not found')
      // router.push(`/`);
    }

    setLoading(false)
  }

  useEffect(() => {
    getCertificateInfo(id)
  }, [])

  if (fetching) return <PageLoader />

  return (
    <AppLayout>
      <AppHead title={t`Certificate`} />

      {loading ? (
        <PageLoader />
      ) : !certificateData ? (
        <Center h={200}>
          <Title className="text-center">
            <Trans>
              We had an issue retrieving your exam information - please reach out to support for assistance.
            </Trans>
          </Title>
        </Center>
      ) : (
        <Container className="py-10">
          <CertificateFile
            name={certificateData.userName}
            certificateNumber={certificateData.certificateNumber}
            certificateId={certificateData.docId}
            score={certificateData.score}
            date={today}
            showDownload
          />
        </Container>
      )}
    </AppLayout>
  )
}

export default UserCertificatePage
