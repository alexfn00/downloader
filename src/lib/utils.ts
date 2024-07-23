import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'

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