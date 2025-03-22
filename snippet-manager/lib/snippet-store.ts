"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Snippet, SnippetInput } from "./types"

interface SnippetState {
  snippets: Snippet[]
  addSnippet: (input: SnippetInput) => void
  updateSnippet: (id: string, input: SnippetInput) => void
  deleteSnippet: (id: string) => void
  toggleFavorite: (id: string) => void
  duplicateSnippet: (id: string) => void
  importSnippets: (snippets: Snippet[]) => void
  exportSnippets: () => Snippet[]
}

// Sample data for initial state
const sampleSnippets: Snippet[] = [
  {
    id: "1",
    title: "Quick Sort Algorithm",
    description: "An efficient sorting algorithm with O(n log n) average time complexity",
    language: "javascript",
    code: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (let val of arr) {
    if (val < pivot) {
      left.push(val);
    } else if (val > pivot) {
      right.push(val);
    } else {
      equal.push(val);
    }
  }
  
  return [
    ...quickSort(left),
    ...equal,
    ...quickSort(right)
  ];
}`,
    tags: ["algorithm", "sorting", "javascript"],
    favorite: true,
    createdAt: "2025-02-15T10:30:00Z",
    updatedAt: "2025-03-10T14:20:00Z",
  },
  {
    id: "2",
    title: "React useEffect Hook",
    description: "Example of using the useEffect hook in React for side effects",
    language: "jsx",
    code: `import { useState, useEffect } from 'react';

function ExampleComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
    // Cleanup function
    return () => {
      // Cancel any pending requests or subscriptions
    };
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}`,
    tags: ["react", "hooks", "javascript"],
    favorite: false,
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-03-15T11:45:00Z",
  },
  {
    id: "3",
    title: "CSS Grid Layout",
    description: "A responsive grid layout using CSS Grid",
    language: "css",
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}`,
    tags: ["css", "layout", "responsive"],
    favorite: true,
    createdAt: "2025-02-05T16:20:00Z",
    updatedAt: "2025-03-01T08:30:00Z",
  },
]

export const useSnippetStore = create<SnippetState>()(
  persist(
    (set, get) => ({
      snippets: sampleSnippets,

      addSnippet: (input: SnippetInput) => {
        const newSnippet: Snippet = {
          id: uuidv4(),
          ...input,
          favorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          snippets: [newSnippet, ...state.snippets],
        }))
      },

      updateSnippet: (id: string, input: SnippetInput) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id
              ? {
                  ...snippet,
                  ...input,
                  updatedAt: new Date().toISOString(),
                }
              : snippet,
          ),
        }))
      },

      deleteSnippet: (id: string) => {
        set((state) => ({
          snippets: state.snippets.filter((snippet) => snippet.id !== id),
        }))
      },

      toggleFavorite: (id: string) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id ? { ...snippet, favorite: !snippet.favorite } : snippet,
          ),
        }))
      },

      duplicateSnippet: (id: string) => {
        const snippetToDuplicate = get().snippets.find((s) => s.id === id)

        if (snippetToDuplicate) {
          const duplicatedSnippet: Snippet = {
            ...snippetToDuplicate,
            id: uuidv4(),
            title: `${snippetToDuplicate.title} (Copy)`,
            favorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set((state) => ({
            snippets: [duplicatedSnippet, ...state.snippets],
          }))
        }
      },

      importSnippets: (snippets: Snippet[]) => {
        set((state) => ({
          snippets: [...snippets, ...state.snippets],
        }))
      },

      exportSnippets: () => {
        return get().snippets
      },
    }),
    {
      name: "snippet-storage",
    },
  ),
)

