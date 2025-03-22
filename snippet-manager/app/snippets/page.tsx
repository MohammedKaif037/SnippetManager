"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Star, Clock, Tag, Search, SortAsc, Trash2, Copy, Edit, Eye, Code } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSnippetStore } from "@/lib/snippet-store"
import type { Snippet } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function SnippetsPage() {
  const { toast } = useToast()
  const { snippets, toggleFavorite, deleteSnippet, duplicateSnippet } = useSnippetStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "az" | "za">("newest")

  useEffect(() => {
    let result = [...snippets]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(lowerSearchTerm) ||
          snippet.description.toLowerCase().includes(lowerSearchTerm) ||
          snippet.code.toLowerCase().includes(lowerSearchTerm) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm)),
      )
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        break
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredSnippets(result)
  }, [snippets, searchTerm, sortOption])

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it anywhere you need.",
    })
  }

  const handleDeleteSnippet = (id: string) => {
    deleteSnippet(id)
    toast({
      title: "Snippet deleted",
      description: "The snippet has been permanently removed.",
    })
  }

  const handleDuplicateSnippet = (id: string) => {
    duplicateSnippet(id)
    toast({
      title: "Snippet duplicated",
      description: "A copy has been created and added to your collection.",
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">All Snippets</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              className="w-full pl-8 sm:w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSortOption("newest")}
                className={cn(sortOption === "newest" && "bg-muted")}
              >
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("oldest")}
                className={cn(sortOption === "oldest" && "bg-muted")}
              >
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("az")} className={cn(sortOption === "az" && "bg-muted")}>
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("za")} className={cn(sortOption === "za" && "bg-muted")}>
                Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/snippets/new">
            <Button size="sm">New Snippet</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {filteredSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Code className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No snippets found</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {searchTerm
                  ? "No snippets match your search criteria. Try a different search term."
                  : "You don't have any snippets yet. Create your first one to get started."}
              </p>
              <Link href="/snippets/new">
                <Button>Create New Snippet</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDeleteSnippet}
                  onDuplicate={handleDuplicateSnippet}
                  onCopyCode={handleCopyCode}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 6)
              .map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDeleteSnippet}
                  onDuplicate={handleDuplicateSnippet}
                  onCopyCode={handleCopyCode}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets
              .filter((snippet) => snippet.favorite)
              .map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDeleteSnippet}
                  onDuplicate={handleDuplicateSnippet}
                  onCopyCode={handleCopyCode}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SnippetCardProps {
  snippet: Snippet
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onCopyCode: (code: string) => void
}

function SnippetCard({ snippet, onToggleFavorite, onDelete, onDuplicate, onCopyCode }: SnippetCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium line-clamp-1">{snippet.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleFavorite(snippet.id)}>
            <Star
              className={`h-4 w-4 ${snippet.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
            <span className="sr-only">Favorite</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/snippets/${snippet.id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </Link>
              <Link href={`/snippets/${snippet.id}/edit`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => onCopyCode(snippet.code)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(snippet.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(snippet.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {snippet.description || "No description provided"}
        </div>
        <Link href={`/snippets/${snippet.id}`}>
          <div className="relative h-[120px] overflow-hidden rounded bg-muted p-2 hover:bg-muted/80 transition-colors">
            <pre className="text-xs overflow-hidden">
              <code>{snippet.code.substring(0, 200)}...</code>
            </pre>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none"></div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {new Date(snippet.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">{new Date(snippet.updatedAt).toLocaleDateString()}</div>
          <div className="flex items-center">
            <Tag className="mr-1 h-3 w-3" />
            {snippet.language}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

