import Head from 'next/head'
import useRxCollection from 'rxdb-hooks/dist/useRxCollection'

export default function Home() {
  const collection = useRxCollection('new')

  collection
    ?.findOne({
      selector: {
        id: '1'
      }
    })
    .exec()
    .then((docs) => console.log(docs))

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button
        onClick={async () => {
          console.log('click')

          await collection?.insert({ id: '1' })

          const doc = await collection?.findOne('1').exec()

          console.log(await doc?.get('words'))

          // await doc?.update({
          //   $push: {
          //     words: {
          //       meaning: 'da'
          //     }
          //   }
          // })

          // doc?.atomicUpdate((data) => {
          //   console.log(data)

          //   data.words[0].meaning = 'dada'

          //   return data
          // })

          // console.log(doc)
        }}
      >
        Click
      </button>
      <div>Home page</div>
      <div className="h-[200vh]"></div>
    </>
  )
}
