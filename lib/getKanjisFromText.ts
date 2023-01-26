import { tokenize, isJapanese, isKanji } from 'wanakana'

export default function getKanjisFromText(text: string) {
  const kanjiList = [] as string[]
  const tokens = tokenize(text).filter((token: string) => isJapanese(token))

  tokens
    .join()
    .split('')
    .forEach((token: string) => {
      isKanji(token) && kanjiList.push(token)
    })

  return kanjiList
}
