import JishoAPI from 'unofficial-jisho-api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword = req.query.keyword?.toString()

  if (keyword) {
    const jisho = new JishoAPI()
    const json = await jisho.searchForPhrase(keyword)

    res.json(json)
  }
}
