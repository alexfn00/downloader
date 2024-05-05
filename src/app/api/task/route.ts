import axios from 'axios'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)
  const taskId = searchParams.get('q') || ''
  const url = process.env.TASK_URL + '/task/' + taskId
  console.log('url:', url)
  // return Response.json(
  //   {
  //     result: 'ok',

  //   },
  //   {
  //     status: 200,
  //   },
  // )
  const result = await axios.get(url)
  console.log('result.data:', result.data)

  return Response.json(
    {
      result: JSON.stringify(result.data),
    },
    {
      status: 200,
    },
  )
}

export const POST = async (req: Request) => {
  const data = await req.json()
  const url = process.env.TASK_URL + '/task/'
  console.log('data:', data)
  console.log('url:', url)
  const result = await axios.post(url, data)
  console.log('result.data:', result.data)

  return Response.json(
    {
      result: result.data,
    },
    {
      status: 200,
    },
  )
}
