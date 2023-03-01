import { useRxDB } from 'rxdb-hooks'

export default function Settings() {
  const db = useRxDB()

  const exportData = (data: object) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `data-${Date.now()}.json`

    link.click()
  }

  const readFile = (event) => {
    const fileReader = new FileReader()
    const { files } = event.target

    fileReader.readAsText(files[0], 'UTF-8')
    fileReader.onload = async (e) => {
      const content = e.target.result

      await db.importJSON(JSON.parse(content))
    }
  }

  return (
    <div>
      <button
        onClick={async () => {
          const data = await db.exportJSON()
          exportData(data)
        }}
      >
        Export all
      </button>
      <br />
      <input type="file" onChange={readFile} />
    </div>
  )
}
