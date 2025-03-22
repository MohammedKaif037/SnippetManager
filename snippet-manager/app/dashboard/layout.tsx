import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, PlusCircle, FolderPlus, Tag, Settings, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">SnippetVault</span>
            </Link>
          </div>
          <div className="flex-1 md:grow-0">
            <MobileNav />
          </div>
          <div className="relative flex flex-1 items-center px-0 md:px-2 lg:px-4">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Link href="/dashboard/new">
              <Button size="sm" className="hidden md:flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Snippet
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Settings className="h-4 w-4" />
                <span className="ml-2">Settings</span>
              </Button>
            </Link>
            <Link href="/logout">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-muted/40 md:flex">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Collections</h2>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
              <FolderPlus className="h-4 w-4" />
              <span className="sr-only">New Collection</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-2">
            <div className="px-3">
              <h3 className="mb-2 px-4 text-sm font-semibold">Folders</h3>
              <div className="space-y-1">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    All Snippets
                  </Button>
                </Link>
                <Link href="/dashboard/favorites">
                  <Button variant="ghost" className="w-full justify-start">
                    Favorites
                  </Button>
                </Link>
                <Link href="/dashboard/archived">
                  <Button variant="ghost" className="w-full justify-start">
                    Archived
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-4 px-3">
              <div className="flex items-center px-4">
                <h3 className="text-sm font-semibold">Tags</h3>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <Tag className="h-4 w-4" />
                  <span className="sr-only">New Tag</span>
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                <Link href="/dashboard/tags/javascript">
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                    JavaScript
                  </Button>
                </Link>
                <Link href="/dashboard/tags/react">
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
                    React
                  </Button>
                </Link>
                <Link href="/dashboard/tags/css">
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2 h-2 w-2 rounded-full bg-purple-500"></span>
                    CSS
                  </Button>
                </Link>
                <Link href="/dashboard/tags/html">
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>
                    HTML
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
          <div className="mt-auto p-4">
            <Button className="w-full" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Snippet
            </Button>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

