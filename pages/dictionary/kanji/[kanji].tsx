import kanjiDictionary from '../../../resources/kanjis.json'

import type { ReactElement } from 'react'
import DictionaryLayout from '../../../components/DictionaryLayout'

export default function Kanji({ kanji }) {
  console.log(kanji)
  return <div>Kanji info for {kanji.kanji}</div>
}

export async function getStaticPaths() {
  const paths = Object.keys(kanjiDictionary.kanjis).map((kanji) => {
    return {
      params: { kanji }
    }
  })

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      kanji: kanjiDictionary.kanjis[params.kanji]
    }
  }
}

Kanji.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
