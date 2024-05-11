import axios from 'axios'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)
  const taskId = searchParams.get('q') || ''
  const url = process.env.TASK_URL + '/task/' + taskId
  const result = await axios.get(url)
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
  const result = await axios.post(url, data)
  return Response.json(
    {
      result: result.data,
    },
    {
      status: 200,
    },
  )
}
