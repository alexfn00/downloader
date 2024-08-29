import { fetchR2Buckets } from '@/app/actions'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs'

const DownloadCounter = () => {
  const anonymous = localStorage.getItem('anonymousSession')
  const { isAuthenticated, user } = useKindeAuth()
  const { data } = useQuery({
    queryFn: () => fetchR2Buckets(anonymous),
    queryKey: ['r2buckets', { anonymous }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })

  return (
    <>
      <div className='w-full mt-4'>
        {data && data.data.length > 0 && <div>Total: {data.data.length}</div>}

        <Table className='border'>
          <TableCaption>
            <div>Your downloaded file list.</div>
            <div>
              The file will be deleted after
              <span className='font-semibold'> 30 </span>
              minutes. Please download it to your local computer as soon as
              possible.
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] text-left'>No.</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead className='text-left'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='text-left'>{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <a href={`https://r2.oecent.net/${item.r2}`}>
                      {item.fileName}
                    </a>
                  </div>
                </TableCell>
                <TableCell className='text-left'>
                  <a href={`https://r2.oecent.net/${item.r2}`}>Save</a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default DownloadCounter
