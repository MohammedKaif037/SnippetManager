"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, FolderOpen, Star, Archive, PlusCircle, Code } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImportExport } from "@/components/import-export"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  if (!isMobile) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            SnippetVault
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-2">
            <Link href="/snippets" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                All Snippets
              </Button>
            </Link>
            <Link href="/snippets/favorites" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Favorites
              </Button>
            </Link>
            <Link href="/snippets/archived" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Archive className="mr-2 h-4 w-4" />
                Archived
              </Button>
            </Link>
          </nav>
          <div className="mt-4">
            <h3 className="mb-2 px-4 text-sm font-semibold">Tags</h3>
            <nav className="grid gap-1">
              <Link href="/snippets/tags/javascript" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                  JavaScript
                </Button>
              </Link>
              <Link href="/snippets/tags/react" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
                  React
                </Button>
              </Link>
              <Link href="/snippets/tags/css" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2 h-2 w-2 rounded-full bg-purple-500"></span>
                  CSS
                </Button>
              </Link>
              <Link href="/snippets/tags/html" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>
                  HTML
                </Button>
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="space-y-2">
            <Link href="/snippets/new" onClick={() => setOpen(false)}>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Snippet
              </Button>
            </Link>
            <Link href="/snippets/manual" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                <Code className="mr-2 h-4 w-4" />
                Manual Entry
              </Button>
            </Link>
          </div>
          <ImportExport />
          <div className="flex items-center justify-between px-4 pt-2">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

