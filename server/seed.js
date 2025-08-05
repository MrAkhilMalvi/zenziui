const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("./utils/auth.js");

const prisma = new PrismaClient();

const sampleComponents = [
  {
    name: "Modern Button",
    description:
      "A sleek, customizable button component with multiple variants and sizes",
    code: `import { Button } from "@/components/ui/button"

export function ModernButton() {
  return (
    <Button variant="default" size="lg" className="hover:scale-105 transition-transform">
      Click me
    </Button>
  )
}`,
    category: "Buttons",
    tags: ["button", "interactive", "ui"],
    complexity: "SIMPLE",
    framework: "REACT",
    isPublic: true,
    isFeatured: true,
  },
  {
    name: "Gradient Card",
    description:
      "A beautiful card component with gradient background and glass morphism effect",
    code: `export function GradientCard({ children, title }) {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-cyan-500/20 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl">
      {title && <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>}
      <div className="text-white/90">
        {children}
      </div>
    </div>
  )
}`,
    category: "Cards",
    tags: ["card", "gradient", "glass", "container"],
    complexity: "INTERMEDIATE",
    framework: "REACT",
    isPublic: true,
    isFeatured: true,
  },
  {
    name: "Animated Navigation",
    description:
      "A responsive navigation component with smooth animations and mobile support",
    code: `import { useState } from "react"
import { Menu, X } from "lucide-react"

export function AnimatedNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">ZenZiUI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Components</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Docs</a>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  )
}`,
    category: "Navigation",
    tags: ["navigation", "responsive", "animated", "mobile"],
    complexity: "ADVANCED",
    framework: "REACT",
    isPublic: true,
    isFeatured: false,
  },
  {
    name: "Loading Spinner",
    description:
      "A smooth, customizable loading spinner with multiple animation styles",
    code: `export function LoadingSpinner({ size = "md", color = "purple" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }
  
  const colorClasses = {
    purple: "border-purple-500",
    blue: "border-blue-500",
    green: "border-green-500"
  }
  
  return (
    <div className={\`animate-spin rounded-full border-2 border-gray-300 \${sizeClasses[size]} \${colorClasses[color]} border-t-transparent\`} />
  )
}`,
    category: "Feedback",
    tags: ["loading", "spinner", "animation", "feedback"],
    complexity: "SIMPLE",
    framework: "REACT",
    isPublic: true,
    isFeatured: false,
  },
  {
    name: "Data Table",
    description:
      "A feature-rich data table with sorting, filtering, and pagination",
    code: `import { useState, useMemo } from "react"

export function DataTable({ data, columns }) {
  const [sortConfig, setSortConfig] = useState(null)
  const [filter, setFilter] = useState("")
  
  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(filter.toLowerCase())
      )
    )
  }, [data, filter])
  
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])
  
  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th 
                key={column.key}
                onClick={() => setSortConfig({
                  key: column.key,
                  direction: sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                })}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map(column => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}`,
    category: "Data Display",
    tags: ["table", "data", "sorting", "filtering", "pagination"],
    complexity: "EXPERT",
    framework: "REACT",
    isPublic: true,
    isFeatured: true,
  },
];

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPassword = await hashPassword("admin123456");
  const admin = await prisma.user.upsert({
    where: { email: "admin@zenziui.com" },
    update: {},
    create: {
      email: "admin@zenziui.com",
      username: "zenziui_admin",
      password: adminPassword,
      firstName: "ZenZi",
      lastName: "Admin",
      bio: "Official ZenZiUI administrator and component curator",
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Created admin user:", admin.username);

  // Create demo user
  const demoPassword = await hashPassword("demo123456");
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@zenziui.com" },
    update: {},
    create: {
      email: "demo@zenziui.com",
      username: "demo_user",
      password: demoPassword,
      firstName: "Demo",
      lastName: "User",
      bio: "Demo user showcasing ZenZiUI components",
      role: "USER",
      isVerified: false,
    },
  });

  console.log("Created demo user:", demoUser.username);

  // Create sample components
  for (const componentData of sampleComponents) {
    const component = await prisma.component.upsert({
      where: {
        authorId_name: {
          authorId: admin.id,
          name: componentData.name,
        },
      },
      update: {},
      create: {
        ...componentData,
        authorId: admin.id,
      },
    });

    console.log("Created component:", component.name);
  }

  // Create a sample collection
  const collection = await prisma.collection.upsert({
    where: {
      authorId_name: {
        authorId: admin.id,
        name: "Essential UI Components",
      },
    },
    update: {},
    create: {
      name: "Essential UI Components",
      description:
        "A curated collection of the most essential UI components for modern web development",
      isPublic: true,
      authorId: admin.id,
    },
  });

  console.log("Created collection:", collection.name);

  // Add components to collection
  const createdComponents = await prisma.component.findMany({
    where: { authorId: admin.id },
    take: 3,
  });

  for (const component of createdComponents) {
    await prisma.componentCollection.upsert({
      where: {
        collectionId_componentId: {
          collectionId: collection.id,
          componentId: component.id,
        },
      },
      update: {},
      create: {
        collectionId: collection.id,
        componentId: component.id,
      },
    });
  }

  console.log("Added components to collection");

  // Add some likes from demo user
  for (const component of createdComponents.slice(0, 2)) {
    await prisma.componentLike.upsert({
      where: {
        userId_componentId: {
          userId: demoUser.id,
          componentId: component.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        componentId: component.id,
      },
    });
  }

  console.log("Added sample likes");

  // Add some comments
  const comments = [
    "This is an amazing component! Great work!",
    "Love the design and functionality. Will definitely use this in my project.",
    "Very clean and well-documented code. Thank you for sharing!",
  ];

  for (let i = 0; i < createdComponents.length && i < comments.length; i++) {
    await prisma.comment.create({
      data: {
        content: comments[i],
        authorId: demoUser.id,
        componentId: createdComponents[i].id,
      },
    });
  }

  console.log("Added sample comments");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
