# ZenZiUI - Modern Component Library Platform

A full-stack component library platform with visual editing, real-time preview, and community features. Built with React, Express.js, PostgreSQL, and modern web technologies.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## 📁 Project Structure

```
zenziui/
├── client/                 # Frontend React application (Independent)
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages/routes
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   ├── package.json       # Client dependencies
│   └── vite.config.ts     # Vite configuration
│
├── server/                # Backend Express.js API (Independent)
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── utils/             # Server utilities
│   ├── prisma/            # Database schema
│   ├── package.json       # Server dependencies
│   └── index.js           # Main server file
│
└── README.md
```

## 🔧 Setup Instructions

### 1. Frontend Setup (Client)

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:8080
```

### 2. Backend Setup (Server)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
nodemon index.js
# Backend runs on http://localhost:3001
```

## 🎯 Features

### 🎨 Frontend Features

- **Component Playground**: Visual component editor with real-time preview
- **Multi-viewport Testing**: Desktop, tablet, and mobile views
- **Advanced Customization**: Layout, styling, effects, and positioning controls
- **Code Generation**: Automatic TypeScript/React code generation
- **Copy & Export**: One-click code copying with visual feedback
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Mobile-first design approach
- **Search & Filter**: Advanced component discovery

### 🔧 Backend Features

- **RESTful API**: Complete CRUD operations for all resources
- **JWT Authentication**: Secure user authentication and authorization
- **File Upload**: Image and document upload with processing
- **Database Integration**: PostgreSQL with Prisma ORM
- **Rate Limiting**: API protection and abuse prevention
- **CORS Support**: Cross-origin resource sharing
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error management

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update profile

### Components

- `GET /api/components` - List components (with filters)
- `GET /api/components/:id` - Get component details
- `POST /api/components` - Create new component
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component
- `POST /api/components/:id/like` - Like/unlike component

### Collections

- `GET /api/collections` - List collections
- `POST /api/collections` - Create collection
- `POST /api/collections/:id/components` - Add component to collection

### Uploads

- `POST /api/uploads` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `GET /api/uploads` - List user uploads

## 🔧 Environment Variables

### Client (.env)

```bash
VITE_API_URL=http://localhost:3001/api
```

### Server (.env)

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zenziui_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:8080"

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH="uploads/"
```

## 🧪 Default Users

After running `npm run db:seed`, you'll have:

**Admin User:**

- Email: `admin@zenziui.com`
- Password: `admin123456`
- Role: Admin with full permissions

**Demo User:**

- Email: `demo@zenziui.com`
- Password: `demo123456`
- Role: Regular user

## 📚 Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Radix UI** - Headless UI components
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Next Themes** - Theme management

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Prisma** - Database ORM
- **JWT** - Authentication
- **Zod** - Schema validation
- **Multer** - File upload handling

## 🛠️ Development Scripts

### Client Scripts

```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # TypeScript type checking
```

### Server Scripts

```bash
cd server
nodemon index.js      # Start development server
npm start             # Start production server
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the ZenZiUI Team**
