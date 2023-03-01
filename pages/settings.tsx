import { useRxDB } from 'rxdb-hooks'
import { useRouter } from 'next/router'
import { useRef } from 'react'

export default function Settings() {
  const router = useRouter()
  const fileInputRef = useRef()
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

  const deleteDate = async () => {
    await db.remove()
    /**
     * Reload page to get a new instance of database
     */
    router.reload(window.location.pathname)
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold">Local data</h2>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold">Export everything</h3>
        <button
          className="flex items-center justify-center rounded-[5px] whitespace-nowrap bg-[#292929] bg-transparent border border-transparent h-8 px-3 leading-3 text-sm font-semibold max-w-fit"
          onClick={async () => {
            const data = await db.exportJSON()
            exportData(data)
          }}
        >
          Export .json
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold">Import</h3>
        <div className="text-xs">
          Imported file will not replace existing data, so you might clear local
          data before. This can’t be undone.
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={readFile}
        />
        <button
          className="flex items-center justify-center rounded-[5px] whitespace-nowrap bg-[#292929] bg-transparent border border-transparent h-8 px-3 leading-3 text-sm font-semibold max-w-fit"
          onClick={() => {
            // Open hidden file-select field
            fileInputRef.current.click()
          }}
        >
          Import data
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold">Clear local data</h3>
        <div className="text-xs">
          This will immediately delete all of your data including cards,
          progress, settings, and more. Page will automatically reload.
        </div>
        <button
          className="flex items-center justify-center rounded-[5px] whitespace-nowrap text-[#ff7066] bg-transparent border border-[#ff7066] h-8 px-3 leading-3 text-sm font-semibold max-w-fit"
          onClick={deleteDate}
        >
          Delete data
        </button>
      </div>
    </div>
  )
}
