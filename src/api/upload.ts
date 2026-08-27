import { imageDb } from '@/utils/firebase'
import { getDownloadURL, ref, StorageReference, uploadBytes, uploadString } from 'firebase/storage'

export const uploadImage = async (imgFile: any, imgId?: any) => {
  const id = imgId || 'id' + Math.random().toString(16).slice(2)
  const imgRef: any = ref(imageDb as any, `images/${id}`)
  await uploadBytes(imgRef, imgFile)
  let downloadUrl = ''
  if (!imgId) {
    downloadUrl = await getDownloadURL(imgRef)
  }
  return {
    status: true,
    id,
    downloadUrl,
  }
}

export const uploadWebcamImage = async (imgSrc: any, imgId?: any) => {
  const id = imgId || 'id' + Math.random().toString(16).slice(2)
  const imageStorageRef: StorageReference = ref(imageDb, `images/${id}`)

  // perform the upload
  await uploadString(imageStorageRef, imgSrc, 'data_url')

  let downloadUrl = ''

  if (!imgId) {
    downloadUrl = await getDownloadURL(imageStorageRef)
  }
  return {
    status: true,
    id,
    downloadUrl,
  }
}
