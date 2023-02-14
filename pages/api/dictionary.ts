import type { NextApiRequest, NextApiResponse } from 'next'

function getURIforWordSearch(keyword: string, page?: string) {
  let uri = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
    keyword
  )}`

  if (page) {
    uri = `${uri}&page=${page}`
  }

  return uri
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword = req.query.keyword?.toString()
  const page = req.query.page?.toString()

  if (keyword) {
    const response = await fetch(getURIforWordSearch(keyword, page))
    const json = await response.json()

    res.json(json)
  }
}
