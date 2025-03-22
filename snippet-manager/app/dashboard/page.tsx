"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Star, Clock, Tag, Search, Filter, SortAsc } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Snippets</h1>
        <div className="flex items-center gap-2">
          <div className="relative md:hidden">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <SortAsc className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Link href="/dashboard/new">
            <Button size="sm" className="md:hidden">
              New
            </Button>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snippets
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 6)
              .map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snippets
              .filter((snippet) => snippet.favorite)
              .map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Snippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{snippet.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {snippet.description || "No description provided"}
        </div>
        <div className="relative h-[120px] overflow-hidden rounded bg-muted p-2">
          <pre className="text-xs overflow-hidden">
            <code>{snippet.code.substring(0, 200)}...</code>
          </pre>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none"></div>
        </div>
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
          <div className="flex items-center">
            <Tag className="mr-1 h-3 w-3" />
            {snippet.language}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Sample data for the snippets
const snippets: Snippet[] = [
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
  {
    id: "4",
    title: "Node.js File System Operations",
    description: "Common file system operations in Node.js",
    language: "javascript",
    code: `const fs = require('fs').promises;
const path = require('path');

async function fileOperations() {
  try {
    // Create a directory
    await fs.mkdir(path.join(__dirname, 'test-directory'), { recursive: true });
    console.log('Directory created successfully');

    // Write to a file
    await fs.writeFile(
      path.join(__dirname, 'test-directory', 'test-file.txt'),
      'Hello, Node.js File System!'
    );
    console.log('File written successfully');

    // Read from a file
    const data = await fs.readFile(
      path.join(__dirname, 'test-directory', 'test-file.txt'),
      'utf8'
    );
    console.log('File content:', data);

    // Append to a file
    await fs.appendFile(
      path.join(__dirname, 'test-directory', 'test-file.txt'),
      '\nAppended content!'
    );
    console.log('Content appended successfully');

    // List directory contents
    const files = await fs.readdir(path.join(__dirname, 'test-directory'));
    console.log('Directory contents:', files);

    // Get file stats
    const stats = await fs.stat(
      path.join(__dirname, 'test-directory', 'test-file.txt')
    );
    console.log('File stats:', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    });

  } catch (error) {
    console.error('Error during file operations:', error);
  }
}

fileOperations();`,
    tags: ["node.js", "filesystem", "javascript"],
    favorite: false,
    createdAt: "2025-01-10T13:45:00Z",
    updatedAt: "2025-02-20T10:15:00Z",
  },
  {
    id: "5",
    title: "SQL JOIN Query",
    description: "Example of SQL JOIN operations between tables",
    language: "sql",
    code: `-- Create sample tables
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  amount DECIMAL(10, 2),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Insert sample data
INSERT INTO customers (customer_id, name, email)
VALUES 
  (1, 'John Doe', 'john@example.com'),
  (2, 'Jane Smith', 'jane@example.com'),
  (3, 'Bob Johnson', 'bob@example.com');

INSERT INTO orders (order_id, customer_id, amount)
VALUES
  (101, 1, 99.99),
  (102, 1, 49.50),
  (103, 2, 149.99),
  (104, 3, 29.99),
  (105, 2, 89.99);

-- INNER JOIN: Get all orders with customer information
SELECT 
  c.customer_id,
  c.name,
  c.email,
  o.order_id,
  o.amount,
  o.order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date DESC;

-- LEFT JOIN: Get all customers and their orders (if any)
SELECT 
  c.customer_id,
  c.name,
  c.email,
  o.order_id,
  o.amount,
  o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.name;

-- Aggregate data: Get total order amount per customer
SELECT 
  c.customer_id,
  c.name,
  COUNT(o.order_id) AS order_count,
  SUM(o.amount) AS total_spent,
  AVG(o.amount) AS average_order
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_spent DESC;`,
    tags: ["sql", "database", "query"],
    favorite: true,
    createdAt: "2025-02-25T11:30:00Z",
    updatedAt: "2025-03-18T09:20:00Z",
  },
  {
    id: "6",
    title: "HTML Form Template",
    description: "Accessible HTML form with validation",
    language: "html",
    code: `<form class="contact-form" action="/submit" method="post">
  <div class="form-group">
    <label for="name">Full Name <span aria-hidden="true">*</span></label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      aria-required="true"
      placeholder="Enter your full name"
    >
    <div class="error-message" id="name-error" aria-live="polite"></div>
  </div>
  
  <div class="form-group">
    <label for="email">Email Address <span aria-hidden="true">*</span></label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      aria-required="true"
      placeholder="your.email@example.com"
    >
    <div class="error-message" id="email-error" aria-live="polite"></div>
  </div>
  
  <div class="form-group">
    <label for="phone">Phone Number</label>
    <input 
      type="tel" 
      id="phone" 
      name="phone"
      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
      placeholder="123-456-7890"
    >
    <small>Format: 123-456-7890</small>
    <div class="error-message" id="phone-error" aria-live="polite"></div>
  </div>
  
  <div class="form-group">
    <label for="subject">Subject <span aria-hidden="true">*</span></label>
    <select id="subject" name="subject" required aria-required="true">
      <option value="" disabled selected>Select a subject</option>
      <option value="general">General Inquiry</option>
      <option value="support">Technical Support</option>
      <option value="billing">Billing Question</option>
      <option value="other">Other</option>
    </select>
    <div class="error-message" id="subject-error" aria-live="polite"></div>
  </div>
  
  <div class="form-group">
    <label for="message">Message <span aria-hidden="true">*</span></label>
    <textarea 
      id="message" 
      name="message" 
      rows="5" 
      required 
      aria-required="true"
      placeholder="Type your message here..."
    ></textarea>
    <div class="error-message" id="message-error" aria-live="polite"></div>
  </div>
  
  <div class="form-group checkbox-group">
    <input type="checkbox" id="consent" name="consent" required aria-required="true">
    <label for="consent">
      I consent to having this website store my submitted information
    </label>
    <div class="error-message" id="consent-error" aria-live="polite"></div>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="submit-button">Submit</button>
    <button type="reset" class="reset-button">Reset Form</button>
  </div>
</form>`,
    tags: ["html", "form", "accessibility"],
    favorite: false,
    createdAt: "2025-03-05T14:10:00Z",
    updatedAt: "2025-03-20T16:30:00Z",
  },
]

