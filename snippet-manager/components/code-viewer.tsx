"use client"

import { useEffect, useState } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeViewerProps {
  code: string
  language: string
}

export function CodeViewer({ code, language }: CodeViewerProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Map language values to Prism-supported languages
  const getPrismLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      jsx: "jsx",
      html: "html",
      css: "css",
      python: "python",
      java: "java",
      csharp: "csharp",
      php: "php",
      ruby: "ruby",
      go: "go",
      rust: "rust",
      sql: "sql",
      bash: "bash",
      json: "json",
      markdown: "markdown",
      yaml: "yaml",
      graphql: "graphql",
    }

    return languageMap[lang] || "javascript"
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const theme = resolvedTheme === "dark" ? themes.nightOwl : themes.github

  if (!mounted) {
    return <div className="h-[200px] w-full bg-muted animate-pulse"></div>
  }

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 bg-background/80 backdrop-blur-sm">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <Highlight theme={theme} code={code} language={getPrismLanguage(language)}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={cn("p-4 overflow-auto max-h-[600px]", className)} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })
              // Extract key from lineProps to avoid React warning
              const { key: lineKey, ...restLineProps } = lineProps
              return (
                <div key={lineKey} {...restLineProps}>
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token, key })
                    // Extract key from tokenProps to avoid React warning
                    const { key: tokenKey, ...restTokenProps } = tokenProps
                    return <span key={tokenKey} {...restTokenProps} />
                  })}
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

