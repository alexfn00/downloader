import axios from 'axios'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)
  const author = searchParams.get('q') || ''

  console.log(author)
  const data = {
    name: 'youtube',
    author: author,
  }
  // return Response.json(
  //   {
  //     result: author,
  //   },
  //   {
  //     status: 200,
  //   },
  // )
  const url = process.env.TASK_URL + '/task'
  console.log('url:', url)
  const result = await axios.post(url, data)
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
