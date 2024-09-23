import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8,
)


export function secondsToTimeFormat(seconds: number): string {
  const hrs: number = Math.floor(seconds / 3600);
  const mins: number = Math.floor((seconds % 3600) / 60);
  const secs: number = Math.floor(seconds % 60);

  const formattedHrs: string = String(hrs).padStart(2, '0');
  const formattedMins: string = String(mins).padStart(2, '0');
  const formattedSecs: string = String(secs).padStart(2, '0');

  return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
}

export function download(fileUrl: string, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = fileUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(fileUrl)
}


export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`

  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}


export function bytesToReadableSize(byteSize: number): string {
  const BYTES_IN_KB = 1024;
  const BYTES_IN_MB = 1024 * 1024;
  const BYTES_IN_GB = 1024 * 1024 * 1024;

  if (byteSize >= BYTES_IN_GB) {
    const gbSize = byteSize / BYTES_IN_GB;
    return `${gbSize.toFixed(2)} GB`;
  } else if (byteSize >= BYTES_IN_MB) {
    const mbSize = byteSize / BYTES_IN_MB;
    return `${mbSize.toFixed(2)} MB`;
  } else if (byteSize >= BYTES_IN_KB) {
    const kbSize = byteSize / BYTES_IN_KB;
    return `${kbSize.toFixed(2)} KB`;
  } else {
    return `${byteSize} Bytes`;
  }
}


export function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
  try {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
  } catch (error) {
    console.log('b64toBlob error:', error)
  }
}

export function getAnonymousSession(isAuthenticated: boolean | null) {
  if (typeof window !== 'undefined') {
    const old_session = localStorage.getItem('anonymousSession')
    if (!isAuthenticated && !old_session) {
      localStorage.setItem('anonymousSession', uuidv4())
    }

    if (isAuthenticated) {
      localStorage.removeItem('anonymousSession')
    }

    return localStorage.getItem('anonymousSession')
  } else {
    return null
  }
}
