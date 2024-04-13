export async function GET(res: Request) {
  const shazamSearchURL =
    'https://www.shazam.com/services/amapi/v1/catalog/GB/search?types=artists&term=abc&limit=3'
  const response = await fetch(shazamSearchURL)
  const data = await response.json()
  if (data) {
    return new Response(data.tracks.hits)
  } else {
    return new Response('error')
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log(body)

  return new Response(JSON.stringify({ hello: 'world' }))
}
