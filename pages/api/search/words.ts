import JishoAPI from 'unofficial-jisho-api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jisho = new JishoAPI()
  const json = await jisho.searchForPhrase(req.query.keyword as string)

  res.json(json)
}
