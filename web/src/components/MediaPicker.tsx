'use client'

import { ChangeEvent, useState } from 'react'

interface MediaPickerProps {
  id: string
}

export function MediaPicker({ id }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(null)

  function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewUrl = URL.createObjectURL(files[0])

    setPreview(previewUrl)
  }

  return (
    <>
      <input
        type="file"
        name="coverUrl"
        onChange={handleImageSelected}
        id={id}
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          width={50}
          height={50}
          src={preview}
          alt="Preview media"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
