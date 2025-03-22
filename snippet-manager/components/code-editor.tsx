"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder?: string
  height?: string
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "Type or paste your code here...",
  height = "300px",
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

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

  const theme = resolvedTheme === "dark" ? themes.nightOwl : themes.github

  return (
    <div className="relative" style={{ height }}>
      <Highlight theme={theme} code={value || ""} language={getPrismLanguage(language)}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <>
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                "absolute inset-0 w-full h-full resize-none font-mono p-4 bg-transparent text-transparent caret-foreground outline-none",
                "z-10",
              )}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
            <pre className={cn("absolute inset-0 w-full h-full overflow-auto font-mono p-4", className)} style={style}>
              {value ? (
                tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">{placeholder}</div>
              )}
            </pre>
          </>
        )}
      </Highlight>
    </div>
  )
}

