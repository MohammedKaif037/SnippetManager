"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Edit, Star, Trash2 } from "lucide-react"
import { useSnippetStore } from "@/lib/snippet-store"
import { useToast } from "@/hooks/use-toast"
import type { Snippet } from "@/lib/types"
import { CodeViewer } from "@/components/code-viewer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SnippetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { snippets, toggleFavorite, deleteSnippet } = useSnippetStore()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const foundSnippet = snippets.find((s) => s.id === params.id)
    if (foundSnippet) {
      setSnippet(foundSnippet)
    } else {
      router.push("/snippets")
    }
  }, [params.id, snippets, router])

  if (!snippet) {
    return <div className="container py-12 text-center">Loading snippet...</div>
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code)
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it anywhere you need.",
    })
  }

  const handleDelete = () => {
    deleteSnippet(snippet.id)
    toast({
      title: "Snippet deleted",
      description: "The snippet has been permanently removed.",
    })
    router.push("/snippets")
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(snippet.id)} className="h-9 w-9">
            <Star className={`h-5 w-5 ${snippet.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
            <span className="sr-only">{snippet.favorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopyCode} className="h-9 w-9">
            <Copy className="h-5 w-5" />
            <span className="sr-only">Copy code</span>
          </Button>
          <Link href={`/snippets/${snippet.id}/edit`}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Edit className="h-5 w-5" />
              <span className="sr-only">Edit snippet</span>
            </Button>
          </Link>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete snippet</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the snippet.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="mb-6">
        {snippet.description && (
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">{snippet.description}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="rounded-md overflow-hidden border">
            <CodeViewer code={snippet.code} language={snippet.language} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {snippet.tags.length === 0 && <span className="text-sm text-muted-foreground">No tags</span>}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-4">
              Language: <strong>{snippet.language}</strong>
            </span>
            <span>Last updated: {new Date(snippet.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

