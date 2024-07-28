'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChannelSection from './ChannelSection'
import ChannelTitle from './ChannelTitle'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

const ChannelPage = ({ params }: { params: { id: string } }) => {
  const [search, setSearch] = useState<string>('')
  const [term, setTerm] = useState<string>('')

  const handleSearch = useDebouncedCallback((term) => {
    setSearch(term)
  }, 300)

  return (
    <>
      <div className='text-3xl font-semibold p-4'>
        <ChannelTitle
          params={{
            id: params.id,
          }}
        />
      </div>
      <div className='flex flex-col sm:flex-row items-center'>
        <div className='flex w-full sm:w-1/2 items-center rounded-lg border-2 mx-4 px-4'>
          <Search className='h-8 w-8 ml-2' />
          <Input
            className='w-full px-4 py-4 mr-4 border-none bg-transparent outline-none focus:outline-none focus-visible:ring-transparent '
            type='text'
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              handleSearch(e.target.value)
            }}
            placeholder='Search'
          />

          <Button
            size='sm'
            variant='ghost'
            className='rounded-md m-2'
            onClick={() => {
              setTerm('')
            }}>
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Tabs defaultValue='videos' className='w-full mt-4'>
        <TabsList className='grid w-[400px] grid-cols-3'>
          <TabsTrigger value='videos'>Videos</TabsTrigger>
          <TabsTrigger value='streams'>Alives</TabsTrigger>
          <TabsTrigger value='shorts'>Shorts</TabsTrigger>
        </TabsList>
        <TabsContent value='videos'>
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                params={{
                  id: params.id,
                  type: 'videos',
                  search: search,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='streams'>
          <Card>
            <CardHeader>
              <CardTitle>Alives</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                params={{
                  id: params.id,
                  type: 'streams',
                  search: search,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='shorts'>
          <Card>
            <CardHeader>
              <CardTitle>Shorts</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                params={{
                  id: params.id,
                  type: 'shorts',
                  search: search,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ChannelPage
