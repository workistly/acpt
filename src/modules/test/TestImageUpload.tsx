import NextImage from '@/components/Image/NextImage'
import userAvatar from '@/modules/test/assets/user.svg'
import ModalWebcam from '@/modules/test/ModalWebcam'
import { Trans, useLingui } from '@lingui/react/macro'
import { AspectRatio, Button, Center, Group, Modal, Stack } from '@mantine/core'
import { FC, useEffect, useRef, useState } from 'react'

interface Props {
  onUploadFile: (e: any, file: any) => void
  onWebcamCapture: (val: any) => void
  image: any
  handlePermission: () => void
  webcamAvailable: boolean
  setOpenCamModal: (val: boolean) => void
  openCamModal: boolean
}

const TestImageUpload: FC<Props> = ({
  onUploadFile,
  onWebcamCapture,
  image,
  handlePermission,
  webcamAvailable,
  setOpenCamModal,
  openCamModal,
}) => {
  const { t } = useLingui()
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)

    if (onUploadFile) {
      onUploadFile(objectUrl, selectedFile)
    }

    // free memory when ever this component is unmounted
  }, [selectedFile])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target?.files[0])
  }

  const handleWebcamClick = async () => {
    if (handlePermission) {
      handlePermission()
    }
  }

  useEffect(() => {
    if (webcamAvailable && setOpenCamModal) {
      setOpenCamModal(true)
    }
  }, [webcamAvailable])

  const forwardClickToInputElement = () => {
    if (fileInputRef.current) {
      fileInputRef.current!.click()
    }
  }

  return (
    <Group className="items-end">
      <input
        ref={fileInputRef}
        type="file"
        onChange={onSelectFile}
        className="absolute pointer-events-none opacity-0"
      />

      <AspectRatio ratio={1} onClick={forwardClickToInputElement}>
        <Center w={140} className="bg-gray-50">
          {image ? <img src={image} alt="" /> : <NextImage src={userAvatar} />}
        </Center>
      </AspectRatio>

      <Stack className="items-start">
        <Button onClick={forwardClickToInputElement}>
          <Trans>Upload Image</Trans>
        </Button>

        <Button variant="outline" onClick={handleWebcamClick}>
          <Trans>Take Photo</Trans>
        </Button>
      </Stack>

      <Modal opened={openCamModal} onClose={() => setOpenCamModal(false)} title={t`Webcam`} size="lg">
        <ModalWebcam onClose={() => setOpenCamModal(false)} onCamCaptured={onWebcamCapture} />
      </Modal>
    </Group>
  )
}

export default TestImageUpload
