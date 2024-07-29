'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { sendEmail } from '@/app/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from './ui/use-toast'

export default function ContactUs() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const { mutateAsync: handleEmail, isPending } = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      if (data == 'ok') {
        toast({
          title: 'Message',
          description:
            "Message sent, we'll get back to you as soon as possible",
        })
      }
    },
  })

  return (
    <div className='flex items-center justify-center mt-20'>
      <Card>
        <CardContent>
          <div className='space-y-8 pt-4'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-semibold'>Contact Us</h2>
              <p className='text-zinc-500 dark:text-zinc-400'>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='first-name'>First name</Label>
                  <Input
                    id='first-name'
                    onChange={(e) => {
                      setFirstName(e.target.value)
                    }}
                    placeholder='Enter your first name'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='last-name'>Last name</Label>
                  <Input
                    id='last-name'
                    onChange={(e) => {
                      setLastName(e.target.value)
                    }}
                    placeholder='Enter your last name'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  placeholder='Enter your email'
                  type='email'
                />
              </div>
              <div className='space-y-2'>
                <Label>Pronoun</Label>
                <Select>
                  <SelectTrigger aria-label='Pronoun'>
                    <SelectValue placeholder='Select your pronoun' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Pronouns</SelectLabel>
                      <SelectItem value='he/him'>He/Him</SelectItem>
                      <SelectItem value='she/her'>She/Her</SelectItem>
                      <SelectItem value='they/them'>They/Them</SelectItem>
                      <SelectItem value='prefer not to say'>
                        Prefer not to say
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}
                  placeholder='Enter your message'
                  className='min-h-[100px]'
                />
              </div>
              <Button
                type='submit'
                className='bg-gray-800 text-white'
                onClick={() => {
                  handleEmail({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    message: message,
                  })
                }}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Send message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
