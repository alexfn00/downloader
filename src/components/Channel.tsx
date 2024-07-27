import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChannelSection from './ChannelSection'

const ChannelPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='m-auto flex w-full max-w-sm items-center space-x-2 py-4'>
        <Search />
        <Input type='text' placeholder='Search' />
        <Button type='submit'>Search</Button>
      </div>

      <Tabs defaultValue='videos' className='w-full'>
        <TabsList className='grid w-[400px] grid-cols-3'>
          <TabsTrigger value='videos'>Videos</TabsTrigger>
          <TabsTrigger value='streams'>Alive</TabsTrigger>
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
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='streams'>
          <Card>
            <CardHeader>
              <CardTitle>Streams</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                params={{
                  id: params.id,
                  type: 'streams',
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
