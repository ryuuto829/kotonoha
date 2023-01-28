import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword = req.query.keyword?.toString()

  if (keyword) {
    const kanjiData = await fetch(`https://kanjiapi.dev/v1/kanji/${keyword}`)
    const kanji = await kanjiData.json()

    const svgData = await fetch(
      `https://d1w6u4xc3l95km.cloudfront.net/kanji-2015-03/0${kanji.unicode}.svg`
    )
    const svg = await svgData.text()

    res.json({ kanji, svg })
  }
}
