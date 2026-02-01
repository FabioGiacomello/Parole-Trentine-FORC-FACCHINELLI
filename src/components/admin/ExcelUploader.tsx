import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'

export default function ExcelUploader({ onUpload }: { onUpload: (data: any[]) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      onUpload(json)
    }
    reader.readAsArrayBuffer(file)
  }, [onUpload])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-12 text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Trascina un file Excel</p>
    </div>
  )
}
