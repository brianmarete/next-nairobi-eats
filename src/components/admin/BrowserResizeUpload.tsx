'use client'

import { Upload, toast, useField, useForm } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useCallback, useRef, useState } from 'react'

const ONE_MB = 1024 * 1024
const MAX_SOURCE_SIZE_BYTES = 10 * ONE_MB
const MAX_DIMENSION = 1920
const JPEG_QUALITY = 0.78
const MIN_BYTES_SAVED_TO_REPLACE = 64 * 1024

type ResizeStatus = {
  message: string
  type: 'error' | 'info' | 'success'
}

const formatBytes = (bytes: number): string => {
  if (bytes < ONE_MB) {
    return `${Math.round(bytes / 1024)} KB`
  }

  return `${(bytes / ONE_MB).toFixed(1)} MB`
}

const shouldSkipResize = (file: File): boolean => {
  return (
    !file.type.startsWith('image/') ||
    file.type === 'image/gif' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/avif'
  )
}

const createImageBitmapFromFile = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file, { imageOrientation: 'from-image' })
  }

  const image = new Image()
  const objectUrl = URL.createObjectURL(file)

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Could not load image for resizing.'))
      image.src = objectUrl
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not compress image.'))
          return
        }

        resolve(blob)
      },
      type,
      quality,
    )
  })
}

const getResizedName = (fileName: string, mimeType: string): string => {
  if (mimeType === 'image/png') {
    return fileName.replace(/\.[^.]+$/, '') + '.png'
  }

  return fileName.replace(/\.[^.]+$/, '') + '.jpg'
}

const hasTransparentPixels = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): boolean => {
  const { data } = context.getImageData(0, 0, width, height)

  for (let index = 3; index < data.length; index += 4) {
    if (data[index] < 255) {
      return true
    }
  }

  return false
}

const resizeImageFile = async (file: File): Promise<File> => {
  const sourceImage = await createImageBitmapFromFile(file)
  const sourceWidth = sourceImage.width
  const sourceHeight = sourceImage.height
  const largestSide = Math.max(sourceWidth, sourceHeight)
  const scale = largestSide > MAX_DIMENSION ? MAX_DIMENSION / largestSide : 1
  const targetWidth = Math.max(1, Math.round(sourceWidth * scale))
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not prepare image resizing context.')
  }

  context.drawImage(sourceImage, 0, 0, targetWidth, targetHeight)

  if ('close' in sourceImage && typeof sourceImage.close === 'function') {
    sourceImage.close()
  }

  const outputMimeType =
    file.type === 'image/png' && hasTransparentPixels(context, targetWidth, targetHeight)
      ? 'image/png'
      : 'image/jpeg'
  const resizedBlob = await canvasToBlob(
    canvas,
    outputMimeType,
    outputMimeType === 'image/jpeg' ? JPEG_QUALITY : undefined,
  )

  if (resizedBlob.size >= file.size - MIN_BYTES_SAVED_TO_REPLACE) {
    return file
  }

  return new File([resizedBlob], getResizedName(file.name, outputMimeType), {
    lastModified: Date.now(),
    type: outputMimeType,
  })
}

export const BrowserResizeUpload = () => {
  const { collectionSlug, docConfig, initialState } = useDocumentInfo()
  const { setProcessing } = useForm()
  const { setValue } = useField<File | undefined>({ path: 'file' })
  const [status, setStatus] = useState<ResizeStatus | null>(null)
  const resizeCounterRef = useRef(0)
  const uploadConfig = docConfig && 'upload' in docConfig ? docConfig.upload : undefined

  const handleUploadChange = useCallback(
    async (file?: File) => {
      resizeCounterRef.current += 1
      const resizeId = resizeCounterRef.current

      if (!file) {
        setStatus(null)
        return
      }

      if (shouldSkipResize(file)) {
        setStatus({
          message: 'Selected file type is uploaded without browser resizing.',
          type: 'info',
        })
        return
      }

      if (file.size > MAX_SOURCE_SIZE_BYTES) {
        const message = `Image is ${formatBytes(file.size)}. Please choose an image under ${formatBytes(
          MAX_SOURCE_SIZE_BYTES,
        )}.`

        setValue(undefined)
        setStatus({ message, type: 'error' })
        toast.error(message)
        return
      }

      setProcessing(true)
      setStatus({
        message: `Resizing ${file.name} in the browser before upload...`,
        type: 'info',
      })

      try {
        const resizedFile = await resizeImageFile(file)

        if (resizeCounterRef.current !== resizeId) {
          return
        }

        setValue(resizedFile)

        if (resizedFile === file) {
          setStatus({
            message: `No resize needed. ${file.name} is already optimized enough.`,
            type: 'success',
          })
          return
        }

        setStatus({
          message: `Resized ${file.name} from ${formatBytes(file.size)} to ${formatBytes(
            resizedFile.size,
          )} before upload.`,
          type: 'success',
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not resize image.'

        setValue(undefined)
        setStatus({ message, type: 'error' })
        toast.error(message)
      } finally {
        if (resizeCounterRef.current === resizeId) {
          setProcessing(false)
        }
      }
    },
    [setProcessing, setValue],
  )

  if (!collectionSlug || !uploadConfig) {
    return null
  }

  return (
    <div>
      <Upload
        collectionSlug={collectionSlug}
        initialState={initialState}
        onChange={handleUploadChange}
        uploadConfig={uploadConfig}
      />

      {status && (
        <p
          style={{
            color: status.type === 'error' ? '#c62828' : undefined,
            marginTop: '0.75rem',
          }}
        >
          {status.message}
        </p>
      )}
    </div>
  )
}
