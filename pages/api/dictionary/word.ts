import JishoAPI from 'unofficial-jisho-api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword = req.query.keyword?.toString()

  if (keyword) {
    const jisho = new JishoAPI()
    const json1 = await jisho.searchForPhrase(keyword)

    const data1 = await fetch(
      'https://d1w6u4xc3l95km.cloudfront.net/kanji-2015-03/08a9e.svg'
    )
    const json3 = await data1.text()

    const data = await fetch(`https://kanjiapi.dev/v1/kanji/${keyword[0]}`)
    const json2 = await data.json()

    res.json({ word: json1.data, kanji: json2, test: json3 })
  }
}
