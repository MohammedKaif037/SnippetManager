"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSnippetStore } from "@/lib/snippet-store"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ImportExport() {
  const { toast } = useToast()
  const { snippets, importSnippets } = useSnippetStore()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState("")

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(snippets, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `snippetvault-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Export successful",
        description: `${snippets.length} snippets exported to ${exportFileDefaultName}`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your snippets.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    try {
      setImportError("")
      if (!importData.trim()) {
        setImportError("Please paste your snippet data")
        return
      }

      const parsedData = JSON.parse(importData)

      if (!Array.isArray(parsedData)) {
        setImportError("Invalid data format. Expected an array of snippets.")
        return
      }

      // Validate each snippet has required fields
      const requiredFields = ["id", "title", "language", "code"]
      const isValid = parsedData.every((snippet) => requiredFields.every((field) => snippet.hasOwnProperty(field)))

      if (!isValid) {
        setImportError("Some snippets are missing required fields (id, title, language, code).")
        return
      }

      importSnippets(parsedData)
      setIsImportDialogOpen(false)
      setImportData("")

      toast({
        title: "Import successful",
        description: `${parsedData.length} snippets imported successfully.`,
      })
    } catch (error) {
      console.error("Import error:", error)
      setImportError("Invalid JSON format. Please check your data and try again.")
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setImportData(content)
      } catch (error) {
        console.error("File reading error:", error)
        setImportError("Error reading file. Please try again.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Snippets</DialogTitle>
            <DialogDescription>Import snippets from a JSON file or paste JSON data directly.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Upload JSON file</Label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="import-data">Or paste JSON data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='[{"id": "1", "title": "Example", ...}]'
                className="min-h-[150px] font-mono text-xs"
              />
              {importError && <p className="text-sm text-destructive">{importError}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import Snippets</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

