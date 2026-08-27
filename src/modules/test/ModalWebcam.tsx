import { Trans } from '@lingui/react/macro'
import { AspectRatio, Button, Center, Divider, Group, Loader, Stack, Text } from '@mantine/core'
import clsx from 'clsx'
import { FC, useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

interface Props {
  onClose: () => void
  onCamCaptured: (val: any) => void
}

const ModalWebcam: FC<Props> = ({ onClose, onCamCaptured }) => {
  const webcamRef = useRef<Webcam>(null)
  const [loading, setLoading] = useState(true)

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (onCamCaptured) {
        onCamCaptured(imageSrc)
      }
      onClose()
    }
  }, [webcamRef])

  const handleUserMedia = () => setTimeout(() => setLoading(false), 1_000)

  return (
    <Stack>
      <Text>
        <Trans>Capture & upload picture directly from your webcam.</Trans>
      </Text>

      {loading && (
        <AspectRatio ratio={16 / 9}>
          <Center>
            <Loader />
          </Center>
        </AspectRatio>
      )}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        className={clsx('object-cover rounded-md', loading && 'absolute opacity-0 pointer-events-none')}
      />

      <Divider />

      <Group className="justify-between">
        <Button variant="outline" onClick={onClose}>
          <Trans>Cancel</Trans>
        </Button>

        <Button onClick={capture} disabled={loading}>
          <Trans>Capture Photo</Trans>
        </Button>
      </Group>
    </Stack>
  )
}

export default ModalWebcam
