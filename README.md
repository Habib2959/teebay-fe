````markdown
# TeeBay Frontend

A modern React + TypeScript + Vite frontend application for TeeBay, featuring Apollo Client for GraphQL state management, React Hook Form for form handling, and comprehensive authentication.

## 📋 Project Description

TeeBay Frontend is a responsive web application where users can:

- **Browse Products**: View available products for sale or rent
- **List Products**: Create and manage their own product listings
- **Buy/Sell/Rent**: Execute transactions with other users
- **Manage Profile**: Update personal information and settings
- **Track Transactions**: View history of all buying, selling, and rental activities

## ✨ Features

- **Apollo Client Integration**: In-memory caching with automatic cache management
- **Authentication**: Secure login/registration with JWT token management
- **Protected Routes**: Route protection for authenticated users only
- **React Hook Form**: Efficient form validation and submission
- **TypeScript**: Full type safety across the application
- **Responsive Design**: Mobile-friendly UI components
- **Real-time Updates**: Automatic cache synchronization with backend
- **Error Handling**: User-friendly error messages and notifications
- **Docker Support**: Containerized development and production builds

## 🛠️ Prerequisites

- **Node.js**: v20 or higher
- **npm** or **yarn**
- **Docker & Docker Compose**: For containerized development (optional)

## 📁 Project Structure

```
teebay-fe/
├── src/
│   ├── apollo/
│   │   └── client.ts                 # Apollo Client configuration with cache
│   ├── assets/
│   │   └── react.svg                 # Assets and images
│   ├── components/
│   │   ├── FormError.tsx             # Error message component
│   │   ├── Modal.tsx                 # Modal dialog component
│   │   ├── MultiSelect.tsx           # Multi-select dropdown
│   │   ├── Navbar.tsx                # Navigation bar
│   │   ├── ProductCard.tsx           # Product card component
│   │   ├── ProtectedRoute.tsx         # Route protection wrapper
│   │   ├── Select.tsx                # Select dropdown component
│   │   ├── TextArea.tsx              # Text area input component
│   │   └── TextInput.tsx             # Text input component
│   ├── contexts/
│   │   └── AuthContext.tsx           # Authentication context provider
│   ├── graphql/
│   │   ├── queries.ts                # GraphQL query definitions
│   │   └── mutations.ts              # GraphQL mutation definitions
│   ├── hooks/
│   │   └── useAuth.ts                # Custom authentication hook
│   ├── pages/
│   │   ├── AddProduct.tsx            # Add new product page
│   │   ├── EditProduct.tsx           # Edit product page
│   │   ├── Home.tsx                  # Home/dashboard page
│   │   ├── Login.tsx                 # Login page
│   │   ├── MyTransactions.tsx        # Transactions history page
│   │   ├── ProductDetail.tsx         # Product detail page
│   │   ├── Products.tsx              # Products listing page
│   │   └── Register.tsx              # Registration page
│   ├── types/
│   │   ├── index.ts                  # All type exports
│   │   ├── auth.types.ts             # Authentication types
│   │   ├── component.types.ts        # Component prop types
│   │   ├── context.types.ts          # Context types
│   │   ├── models.types.ts           # Data model types
│   │   ├── product.types.ts          # Product types
│   │   ├── register.types.ts         # Registration form types
│   │   ├── transactions.types.ts     # Transaction types
│   │   └── user.types.ts             # User types
│   ├── utils/
│   │   └── (utility functions)
│   ├── App.tsx                       # Main App component with routing
│   ├── index.css                     # Global styles
│   ├── main.tsx                      # Application entry point
│   └── vite-env.d.ts                 # Vite environment types
├── public/
│   └── vite.svg                      # Vite logo
├── Dockerfile                        # Production Docker image
├── Dockerfile.dev                    # Development Docker image
├── docker-compose.yml                # Docker composition for services
├── eslint.config.js                  # ESLint configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── vite.config.js                    # Vite configuration
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.node.json                # TypeScript Node configuration
├── package.json                      # Project dependencies
├── index.html                        # HTML entry point
├── .dockerignore                     # Docker build exclusions
└── README.md                         # This file
```

## 🚀 Quick Start

### Local Development (Without Docker)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```

### Docker Development

1. **Ensure backend is running** (see backend README)

2. **Build and start the frontend**

   ```bash
   docker-compose up -d
   ```

   Frontend will be available at `http://localhost:5173`

3. **View logs**

   ```bash
   docker-compose logs -f frontend
   ```

4. **Stop containers**
   ```bash
   docker-compose down
   ```

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier (if configured)

# Type Checking
npm run type-check       # Check TypeScript types (if script exists)
```

## 🔌 API Integration

### Backend Connection

The frontend connects to the backend GraphQL API at:

- **Local Development**: `http://localhost:4000/graphql`
- **Docker**: `http://teebay-app:4000/graphql`

The Apollo Client automatically includes JWT tokens in all requests via the `authLink` middleware.

### Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in browser's localStorage
4. Token included in all API requests via Authorization header
5. User data cached in Apollo Client
6. Protected routes verify authentication status

## 🎨 UI Components

### Key Components

- **FormError**: Displays validation and error messages
- **Modal**: Reusable modal dialog for confirmations and forms
- **MultiSelect**: Multi-select dropdown for product categories
- **Navbar**: Navigation bar with user menu
- **ProductCard**: Displays product information in card format
- **ProtectedRoute**: Route wrapper for authentication-protected pages
- **TextInput**: Reusable text input with validation
- **TextArea**: Multi-line text input component

## 🔐 Authentication

### Features

- JWT token-based authentication
- Automatic token refresh (if implemented)
- Protected routes for authenticated users only
- Logout functionality
- Session persistence

### Storage

- JWT tokens stored in localStorage
- User data cached in Apollo Client
- Automatic cache updates on mutations

## 🗂️ Technologies

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool and dev server
- **Apollo Client**: GraphQL client with caching
- **React Hook Form**: Efficient form state management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework (if configured)
- **GraphQL**: Query language for API

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API
VITE_GRAPHQL_URI=http://localhost:4000/graphql
```

## 🐳 Docker

### Dockerfile (Production)

Serves the built React app using a Node.js HTTP server.

### Dockerfile.dev (Development)

Runs the Vite dev server with hot module reload for development.

### Docker Compose

Connects the frontend to the backend through a shared Docker network.

## 🚦 Development Workflow

1. Start backend: `cd ../teebay-be && docker-compose up -d`
2. Start frontend: `docker-compose up -d`
3. Access app at `http://localhost:5173`
4. Edit files in `src/` and see changes instantly via hot reload
5. Check browser console for errors

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Issue**: "Failed to fetch" errors in the browser console

**Solutions**:

1. Verify backend is running: `docker ps | grep teebay-app`
2. Test backend: `curl http://localhost:4000/health`
3. Check CORS settings in backend `src/index.ts`
4. Verify `VITE_GRAPHQL_URI` environment variable

### Port Already in Use

- Change the port in `docker-compose.yml` or `vite.config.js`
- Or kill the process: `lsof -ti :5173 | xargs kill -9`

### Module Not Found Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### TypeScript Errors

- Rebuild TypeScript: `npm run type-check` (if available)
- Check `tsconfig.json` is properly configured

## 📝 License

This project is part of the TeeBay application.

## 👥 Support

For issues or questions, please contact the development team.
````
